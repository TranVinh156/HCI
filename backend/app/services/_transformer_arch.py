"""
Shared Transformer architecture definitions.
Được import bởi sign_service.py (backend) VÀ demo_inference.py / demo_sentence.py (local demo).
Phải match CHÍNH XÁC với kaggle_train_wlasl.py và kaggle_train_how2sign.py.
"""
from __future__ import annotations
import math
import torch
import torch.nn as nn

# ── Defaults (override bằng tham số khi khởi tạo) ──────────────────
_NUM_FRAMES_WORD  = 32
_NUM_FRAMES_SENT  = 256
_NUM_KP_WLASL     = 75    # 33 pose + 21 LH + 21 RH
_NUM_KP_HOW2SIGN  = 67    # 25 body + 21 LH + 21 RH
_KP_DIMS          = 3
_PAD_IDX          = 0
_BOS_IDX          = 1


class PositionalEncoding(nn.Module):
    def __init__(self, d_model: int, max_len: int = 512, dropout: float = 0.1):
        super().__init__()
        self.dropout = nn.Dropout(dropout)
        pe  = torch.zeros(max_len, d_model)
        pos = torch.arange(max_len, dtype=torch.float).unsqueeze(1)
        div = torch.exp(torch.arange(0, d_model, 2).float() *
                        (-math.log(10000.0) / d_model))
        pe[:, 0::2] = torch.sin(pos * div)
        pe[:, 1::2] = torch.cos(pos * div)
        self.register_buffer("pe", pe.unsqueeze(0))

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.dropout(x + self.pe[:, :x.size(1)])


# ── WLASL Word Classifier ─────────────────────────────────────────────
class SignTransformer(nn.Module):
    """
    Encoder-only Transformer với CLS token cho nhận dạng từ đơn lẻ.
    Match với checkpoint ml/models/wlasl_transformer.pt (see backend/_ckpt_info.json):
    4 encoder layers, input LayerNorm trên 225 dims, head intermediate 128.
    """
    def __init__(self, num_classes: int,
                 num_kp: int = _NUM_KP_WLASL, kp_dims: int = _KP_DIMS,
                 d_model: int = 256, nhead: int = 8, num_layers: int = 4,
                 dim_ff: int = 512, dropout: float = 0.2,
                 head_hidden: int = 128):
        super().__init__()
        self.input_norm = nn.LayerNorm(num_kp * kp_dims)
        self.embed     = nn.Linear(num_kp * kp_dims, d_model)
        self.cls_token = nn.Parameter(torch.zeros(1, 1, d_model))
        self.pos_enc   = PositionalEncoding(d_model, max_len=_NUM_FRAMES_WORD + 1,
                                             dropout=dropout)
        enc_layer = nn.TransformerEncoderLayer(
            d_model=d_model, nhead=nhead, dim_feedforward=dim_ff,
            dropout=dropout, batch_first=True, activation="gelu",
        )
        self.encoder = nn.TransformerEncoder(enc_layer, num_layers=num_layers)
        self.norm = nn.LayerNorm(d_model)
        self.head = nn.Sequential(
            nn.Linear(d_model, head_hidden), nn.GELU(), nn.Dropout(dropout),
            nn.Linear(head_hidden, num_classes),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # x: (B, T, num_kp, kp_dims)
        B = x.size(0)
        x = self.input_norm(x.flatten(2))
        x = self.embed(x)
        cls = self.cls_token.expand(B, -1, -1)
        x = self.pos_enc(torch.cat([cls, x], dim=1))
        return self.head(self.norm(self.encoder(x)[:, 0]))


# ── How2Sign Seq2Seq ─────────────────────────────────────────────────
class SignToTextTransformer(nn.Module):
    """
    Encoder-Decoder Transformer cho dịch câu liên tục.
    Match với kaggle_train_how2sign.py :: SignToTextTransformer.
    """
    def __init__(self, vocab_size: int,
                 num_kp: int = _NUM_KP_HOW2SIGN, kp_dims: int = _KP_DIMS,
                 d_model: int = 256, nhead: int = 8,
                 num_enc_layers: int = 6, num_dec_layers: int = 6,
                 dim_ff: int = 1024, dropout: float = 0.1):
        super().__init__()
        self.d_model   = d_model
        self.src_proj  = nn.Linear(num_kp * kp_dims, d_model)
        self.src_pos   = PositionalEncoding(d_model, max_len=_NUM_FRAMES_SENT + 1,
                                             dropout=dropout)
        enc_layer = nn.TransformerEncoderLayer(
            d_model, nhead, dim_ff, dropout, batch_first=True,
            activation="gelu", norm_first=True)
        self.encoder   = nn.TransformerEncoder(enc_layer, num_enc_layers,
                                                norm=nn.LayerNorm(d_model))
        self.tgt_embed = nn.Embedding(vocab_size, d_model, padding_idx=_PAD_IDX)
        self.tgt_scale = math.sqrt(d_model)
        self.tgt_pos   = PositionalEncoding(d_model, max_len=64 + 1, dropout=dropout)
        dec_layer = nn.TransformerDecoderLayer(
            d_model, nhead, dim_ff, dropout, batch_first=True,
            activation="gelu", norm_first=True)
        self.decoder   = nn.TransformerDecoder(dec_layer, num_dec_layers,
                                                norm=nn.LayerNorm(d_model))
        self.out_proj  = nn.Linear(d_model, vocab_size)

    def encode(self, src: torch.Tensor,
               src_key_padding_mask: torch.Tensor | None = None) -> torch.Tensor:
        return self.encoder(self.src_pos(self.src_proj(src.flatten(2))),
                            src_key_padding_mask=src_key_padding_mask)

    def decode(self, tgt: torch.Tensor, memory: torch.Tensor,
               tgt_mask: torch.Tensor | None = None,
               memory_key_padding_mask: torch.Tensor | None = None) -> torch.Tensor:
        x = self.tgt_pos(self.tgt_embed(tgt) * self.tgt_scale)
        return self.decoder(x, memory, tgt_mask=tgt_mask,
                            memory_key_padding_mask=memory_key_padding_mask)

    def forward(self, src: torch.Tensor, tgt: torch.Tensor,
                src_key_padding_mask: torch.Tensor | None = None) -> torch.Tensor:
        T = tgt.size(1)
        tm  = nn.Transformer.generate_square_subsequent_mask(T, device=src.device)
        mem = self.encode(src, src_key_padding_mask)
        return self.out_proj(self.decode(tgt, mem, tgt_mask=tm,
                                         memory_key_padding_mask=src_key_padding_mask))
