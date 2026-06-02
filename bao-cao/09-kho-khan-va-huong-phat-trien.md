# 9. Khó khăn và hướng phát triển

## 9.1. Khó khăn

### Dữ liệu

- Dữ liệu ký hiệu chất lượng cao còn hạn chế, đặc biệt là dữ liệu phù hợp với trẻ em và người học mới.
- Các bộ dữ liệu công khai như WLASL hữu ích cho nhận diện theo từ, nhưng chưa bao phủ hết nhu cầu học tập, ngữ cảnh giao tiếp và ký hiệu liên tục.
- Dữ liệu camera thực tế có nhiều biến thiên về ánh sáng, góc quay, khoảng cách, tốc độ thực hiện ký hiệu và hình dạng bàn tay.
- Một số ký hiệu cần thông tin từ chuyển động cơ thể, biểu cảm khuôn mặt và ngữ cảnh, không chỉ riêng landmark bàn tay.
- Việc cân bằng số mẫu giữa các lớp là khó, vì một số ký hiệu có nhiều video/ảnh hơn các ký hiệu khác.

### Mô hình

- Mô hình có kết quả validation khá tốt trong môi trường notebook, nhưng độ ổn định với camera thực tế chưa được chứng minh đầy đủ.
- Nhận diện ký hiệu dễ bị nhầm lẫn giữa các lớp có hình dạng bàn tay gần giống nhau.
- Các ký hiệu có yêu cầu chuyển động liên tục cần mô hình nắm bắt được trình tự thời gian tốt hơn.
- Model hiện tại cần đánh giá thêm về top-k accuracy, confusion matrix và khả năng tổng quát hóa trên người dùng mới.
- Việc kết hợp nhiều pipeline như alphabet CNN, WLASL Transformer, landmark BiLSTM và Gemini làm tăng độ phức tạp khi tích hợp và debug.

### Giao diện

- Người dùng chính là trẻ em nên mỗi màn hình phải thật rõ ràng, ít tải nhận thức và có phản hồi trực quan.
- Chưa có kiểm thử khả dụng với trẻ khiếm thính, phụ huynh hoặc giáo viên nên chưa thể kết luận giao diện đã thật sự dễ dùng.
- Một số màn hình cần kiểm tra thêm trên nhiều kích thước thiết bị để tránh lỗi bố cục, chữ quá dài hoặc nút khó bấm.
- Chức năng camera cần hướng dẫn rõ hơn khi không phát hiện tay, khi ánh sáng yếu hoặc khi người học đặt tay ngoài khung hình.
- Phản hồi học tập hiện tại còn tổng quát, chưa chỉ ra cụ thể người học sai ở vị trí tay, hướng tay hay chuyển động nào.

### Tích hợp hệ thống

- Frontend, backend, database và model ML phụ thuộc vào nhiều thành phần khác nhau, nên việc cấu hình môi trường có thể mất thời gian.
- Các model TensorFlow/Keras và PyTorch có yêu cầu riêng về dependency, kích thước file và tài nguyên máy.
- Pipeline camera cần đồng bộ thứ tự landmark, số frame, cách chuẩn hóa và nhãn lớp giữa frontend và backend.
- Nếu model chưa load được hoặc file model thiếu, hệ thống cần có trạng thái fallback rõ ràng để không làm gián đoạn demo.
- API cần đảm bảo bảo mật dữ liệu người học, đặc biệt với thông tin profile, lịch sử học và dữ liệu camera.

### Kiểm thử người dùng

- Chưa có thực nghiệm với người dùng thật để đo mức độ dễ hiểu, dễ học và mức độ hứng thú.
- Chưa có số liệu định lượng về thời gian hoàn thành bài học, tỷ lệ trả lời đúng, tần suất lỗi camera và mức độ cải thiện sau nhiều lần học.
- Việc kiểm thử với trẻ em cần quy trình phù hợp về đạo đức, sự đồng ý của phụ huynh/giáo viên và bảo vệ dữ liệu cá nhân.
- Cần so sánh trải nghiệm học có camera/feedback với cách học chỉ xem hình ảnh hoặc video tĩnh.
- Cần thu thập phản hồi từ giáo viên để biết nội dung, độ khó và lượng bài học có phù hợp với lớp học thật hay không.

## 9.2. Hướng phát triển

Các hướng phát triển tiếp theo nên tập trung vào những việc có tác động trực tiếp đến chất lượng học tập và khả năng sử dụng thật:

- Mở rộng bộ dữ liệu ký hiệu với nhiều từ vựng hơn, nhiều người thực hiện hơn và nhiều điều kiện quay khác nhau.
- Bổ sung dữ liệu ký hiệu liên tục và các mẫu câu giao tiếp hằng ngày để ứng dụng gần với tình huống thực tế hơn.
- Cá nhân hóa lộ trình học dựa trên tiến độ, số lần sai, tốc độ học và mức độ khó của từng người học.
- Thêm feedback chi tiết khi người học ký hiệu sai, ví dụ: sai hình dạng bàn tay, sai vị trí tay, sai hướng chuyển động hoặc thiếu frame.
- Cải thiện nhận diện gesture bằng cách kết hợp hand landmark, pose, face expression và motion features.
- Đánh giá model trên tập test độc lập, camera thực tế và nhiều nhóm người dùng khác nhau.
- Hỗ trợ đa ngôn ngữ, trước mắt có thể mở rộng giao diện và nội dung sang tiếng Việt, tiếng Anh và các hệ ký hiệu tương ứng.
- Mở rộng kho hình minh họa, video, pose và SignWriting để mỗi bài học có minh họa rõ ràng hơn.
- Tối ưu hiệu năng inference, giảm độ trễ camera và cải thiện trải nghiệm trên thiết bị cấu hình thấp.
- Bổ sung chế độ offline hoặc cache nội dung bài học cơ bản để người học vẫn luyện tập khi mạng không ổn định.
- Kiểm thử với người dùng thật, bao gồm trẻ khiếm thính, phụ huynh và giáo viên, để điều chỉnh giao diện và nội dung học.
- Xây dựng dashboard báo cáo chi tiết hơn cho giáo viên/quản trị viên, gồm tiến độ, lỗi hay gặp và đề xuất bài ôn tập.
- Bổ sung quy trình quản lý nội dung trong admin, gồm kiểm duyệt, validation dữ liệu, phân quyền và lịch sử thay đổi.
- Tăng cường bảo mật và quyền riêng tư cho dữ liệu người học, đặc biệt với ảnh/video hoặc landmark từ camera.
