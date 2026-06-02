## **ĐẠI HỌC QUỐC GIA HÀ NỘI TRƯỜNG ĐẠI HỌC CÔNG NGHỆ** 

**—————***—————** 

## **BÁO CÁO BÀI TẬP LỚN: PHÁT TRIỂN ỨNG DỤNG HỖ TRỢ TRẺ ĐẶC BIỆT** 

**ĐỀ TÀI: EMO GARDEN - WEB HỖ TRỢ TRẺ TỰ KỶ LUYỆN NHẬN DIỆN VÀ BIỂU ĐẠT CẢM XÚC** 

**Giảng viên:** TS. Ngô Thị Duyên 

**Môn học:** Tương Tác Người Máy 

**==> picture [80 x 12] intentionally omitted <==**

_1_ 

## **DANH SÁCH THÀNH VIÊN NHÓM** 

|||||
|---|---|---|---|
|Họ và tên|Mã sinh<br>viên|Nội dung thực hiện|Đóng<br>góp|
|||||
|Nguyễn Văn<br>Thịnh<br>(Nhóm<br>trưởng)|23021726|Phân chia công việc, merge code các<br>thành viên<br>Xây dựng kiến trúc dự án, cơ sở dữ liệu<br>Phát triển backend game click, cơ chế<br>Gamification, game click Chiếc hộp<br>cảm xúc<br>Viết báo cáo, slide, quay video thuyết<br>trình + demo|18%|
|Đào Ngọc<br>Tân|23021690|Thiết kế FE + BE cho: quên mật khẩu,<br>profile, 2 game Computer Vision<br>Phát triển FE game click Thám tử cảm<br>xúc<br>Phát triển chức năng chatbot<br>Đồng bộ FE cho site user<br>Viết báo cáo (về game CV)|18.5%|
|Hoàng Thị<br>Thanh Nga|23021647|Phát triển quá trình đăng nhập, đăng ký<br>Phát triển phần học cảm xúc<br>Phát triển game click Xưởng cảm xúc;<br>Hoàn thiện logic quản lý thẻ học<br>(admin)|16.25%|
|Bùi Thu<br>Phương|23021667|Phát triển quá trình đăng nhập, đăng ký<br>Phát triển phần học cảm xúc<br>Phát triển game click Cảm xúc đúng<br>chỗ<br>Hoàn thiện logic quản lý thẻ học<br>(admin)|16.25%|
|Nguyễn<br>Công Hùng|23021567|Phát triển FE profile<br>Phát triển chức năng report, thiết kế;<br>Phát triển site admin (FE + quản lý<br>user, report)|15.5%|
|Nguyễn<br>Phương Linh|23021609|Thiết kế FE home user, select game,<br>select level<br>Thực hiện xây dựng data cho dự án<br>(data cho game, thẻ học)|15.5%|



_2_ 

## LỜI CẢM ƠN 

Lời đầu tiên, nhóm chúng em xin gửi lời cảm ơn chân thành và sâu sắc nhất tới **TS. Ngô Thị Duyên** . Trong suốt quá trình học tập và thực hiện đề tài, Cô đã tận tình hướng dẫn, định hướng chuyên môn và truyền đạt những kiến thức nền tảng quý báu, giúp chúng em có đủ cơ sở lý luận và thực tiễn để xây dựng hệ thống **Emo Garden** . 

Việc thực hiện đề tài về hỗ trợ trẻ rối loạn phổ tự kỷ (ASD) là một thách thức lớn nhưng cũng đầy ý nghĩa đối với chúng em. Mặc dù đã nỗ lực hết mình để hoàn thiện sản phẩm từ khâu phân tích, thiết kế đến cài đặt hệ thống, nhưng do vốn kiến thức và kinh nghiệm thực tế còn hạn chế, báo cáo khó tránh khỏi những thiếu sót. Chúng em rất mong nhận được những ý kiến đóng góp, chỉ bảo của Cô để đề tài được hoàn thiện hơn và có thể phát triển xa hơn trong tương lai. 

Chúng em xin chân thành cảm ơn! 

_3_ 

## LỜI CAM ĐOAN 

Chúng em xin cam đoan rằng Báo cáo môn học Tương tác Người - Máy với đề tài **"Emo Garden"** là sản phẩm trí tuệ của nhóm thực hiện. Nội dung báo cáo phản ánh trung thực quá trình phân tích, thiết kế và cài đặt hệ thống thực tế mà nhóm đã triển khai. 

Các nội dung, kết quả và mã nguồn (source code) được trình bày trong báo cáo này đều do nhóm tự xây dựng và phát triển dựa trên kiến thức đã học và quá trình nghiên cứu thực tế. Mọi nguồn tài liệu tham khảo, ý tưởng kế thừa hoặc trích dẫn từ các công trình khác đều đã được ghi rõ nguồn gốc và chú thích đầy đủ trong danh mục Tài liệu tham khảo. 

Chúng em xin chịu hoàn toàn trách nhiệm về tính trung thực của báo cáo này. Nếu phát hiện bất kỳ sự gian lận hoặc sao chép không hợp lệ nào, nhóm xin chấp nhận mọi hình thức kỷ luật theo quy định của cô. 

Hà Nội, ngày  tháng 12 năm 2025 

Người thực hiện 

_4_ 

## DANH SÁCH HÌNH VẼ 

Hình 1.1. Biểu đồ thể hiện sự gia tăng tỷ lệ trẻ mắc ASD theo báo cáo của CDC giai đoạn 2000 - 2022 Hình 3.1. Biểu đồ ca sử dụng tổng quát hệ thống Emo Garden 

Hình 4.1. Sơ đồ tuần tự cho ca sử dụng học và ôn tập cảm xúc 

Hình 4.2. Sơ đồ tuần tự cho ca sử dụng luyện tập biểu hiện cảm xúc 

Hình 4.3 Sơ đồ tuần tự cho ca sử dụng chơi game nhận diện cảm xúc 

Hình 4.4. Sơ đồ tuần tự cho ca sử dụng tạo báo cáo 

Hình 4.5. Sơ đồ tuần tự cho ca sử dụng sử dụng Chatbot 

Hình 4.6 Cơ sở dữ liệu của dự án 

Hình 5.1. Giao diện tổng quan Game CV (khung camera kết hợp vùng hiển thị tình huống/yêu cầu). 

Hình 5.2 Giao diện trạng thái đang nhận diện biểu cảm (hiển thị biểu tượng cảm xúc và phần trăm khớp). 

Hình 5.3 Giao diện game Chiếc hộp cảm xúc 

Hình 5.4 Giao diện game Xưởng cảm xúc 

Hình 5.5 Giao diện game Cảm xúc đúng chỗ 

Hình 5.6 Giao diện game Thám tử cảm xúc 

Hình 5.7. Giao diện báo cáo được gửi 

_5_ 

## DANH SÁCH BẢNG 

Bảng 2.1. Phân tích 6 cảm xúc cơ bản phục vụ xây dựng bài tập và thuật toán AI 

- Bảng 2.2. Các đặc tính kỹ thuật của Frontend (Vanilla JS + Vite) 

- Bảng 2.3. Các thành phần công nghệ Backend 

- Bảng 3.1. Ánh xạ yêu cầu người dùng và chức năng hệ thống 

- Bảng 3.2. Bảng tổng hợp tác nhân và phạm vi sử dụng 

- Bảng 3.3.  Bảng đặc tả chi tiết cho ca sử dụng học và ôn tập các cảm xúc 

- Bảng 3.4.  Bảng đặc tả chi tiết cho ca sử dụng luyện tập biểu hiện cảm xúc 

- Bảng 3.5.  Bảng đặc tả chi tiết cho ca sử dụng luyện tập nhận diện và ôn tập cảm xúc Bảng 3.6.  Bảng đặc tả chi tiết cho ca sử dụng tạo báo cáo 

Bảng 3.7.  Bảng đặc tả chi tiết cho ca sử dụng sử dụng Chatbot 

- Bảng 4.1. Danh sách và vai trò các bảng trong cơ sở dữ liệu 

Bảng 4.2: Danh sách API Quản lý người dùng 

- Bảng 4.3: Danh sách API Trò chơi 

- Bảng 4.4: Danh sách API Game CV 

- Bảng 4.5: Danh sách API nội dung và trợ lý ảo 

Bảng 4.6. Danh sách API báo cáo 

Bảng 4.7. Danh sách API quản trị 

Bảng 5.1: Độ chính xác nhận diện theo từng loại cảm xúc 

_6_ 

## MỤC LỤC 

**LỜI CẢM ƠN .................................................................................................................................. 2 LỜI CAM ĐOAN ............................................................................................................................ 3 DANH SÁCH HÌNH VẼ ................................................................................................................. 4 DANH SÁCH BẢNG ....................................................................................................................... 5 MỤC LỤC ....................................................................................................................................... 6 CHƯƠNG I: ĐẶT VẤN ĐỀ .......................................................................................................... 10** 1. Đặt vấn đề ............................................................................................................................. 10 1.1 Bối cảnh và hiện trạng vấn đề ........................................................................... 10 1.2 Tính cấp thiết của đề tài .................................................................................... 12 2. Các giải pháp đã có và hạn chế .............................................................................................. 12 2.1 Các phương pháp can thiệp truyền thống ....................................................................... 13 2.2 Các giải pháp công nghệ hiện có ................................................................................... 14 2.2.1 Nhóm ứng dụng nhận thức cảm xúc ..................................................................... 14 2.2.2 Nhóm ứng dụng điều tiết cảm xúc ........................................................................ 15 2.2.3 Nhóm ứng dụng có yếu tố biểu đạt và tương tác nâng cao ..................................... 15 2.2.4 Tổng kết............................................................................................................... 16 2.3 Phân tích khoảng trống nghiên cứu ................................................................................ 17 3. Đề xuất giải pháp: Hệ thống Web tương tác đa chiều ............................................................. 18 3.1 Tương tác tự nhiên (NUI) qua Camera .............................................................. 18 3.2 Định lượng hóa đánh giá và số hóa dữ liệu ....................................................... 18 3.3 Bền vững động lực và hỗ trợ bản địa hóa .......................................................... 18 4. Kết quả thử nghiệm và đánh giá sơ bộ ................................................................................... 19 5. Cấu trúc báo cáo .................................................................................................................... 20 **CHƯƠNG 2: KIẾN THỨC NỀN TẢNG ...................................................................................... 22** 1. Cơ sở lý luận về rối loạn phổ tự kỷ ........................................................................................ 22 1.1 Đặc điểm tâm lý học thần kinh và hệ quả thiết kế .......................................................... 22 1.2 Lý thuyết về 6 cảm xúc cơ bản và ứng dụng trong công nghệ ........................................ 23 2. Nền tảng công nghệ thị giác máy tính (CV) ........................................................................... 25 2.1 Tổng quan về bài toán nhận diện cảm xúc khuôn mặt (FER) và ứng dụng thực tiễn ....... 26 2.2 Mạng nơ-ron tích chập (CNN) và ưu thế so với phương pháp truyền thống .................... 27 2.3 Thư viện face-api.js và chiến lược sử dụng mô hình tiền huấn luyện .............................. 27 3. Các công nghệ phát triển hệ thống ......................................................................................... 28 3.1 Vanilla JavaScript và Vite cho Frontend: ....................................................................... 28 3.2 FastAPI và Python cho Backend: Kiến trúc hướng dịch vụ và tích hợp Generative AI.... 29 3.3 Cơ chế truy cập camera và xử lý khung hình thời gian thực bằng getUserMedia ............ 31 3.4 Google Generative AI (Gemini) và kỹ thuật Prompt Engineering theo Rule-base ........... 31 4. Lý thuyết Gamification và HCI trong can thiệp hành vi ......................................................... 32 **CHƯƠNG 3: THU THẬP, PHÂN TÍCH VÀ ĐẶC TẢ YÊU CẦU.............................................. 34** 1. Xác định bài toán và đối tượng sử dụng ................................................................................. 34 1.1 Chân dung người dùng chính: ........................................................................................ 34 1.2 Chân dung người dùng thứ cấp: ..................................................................................... 35 1.3 Phạm vi nghiên cứu và môi trường vận hành ................................................................. 36 

_7_ 

1.4 Kết luận ........................................................................................................................ 36 2. Thu thập và phân tích yêu cầu ............................................................................................... 37 2.1 Yêu cầu chức năng ........................................................................................................ 37 2.2 Yêu cầu phi chức năng .................................................................................................. 40 3. Phân tích và đặc tả ca sử dụng ............................................................................................... 42 3.1 Xác định các tác nhân và ca sử dụng chính của hệ thống ................................................ 42 3.2 Ca sử dụng: Học và ôn tập các cảm xúc ......................................................................... 44 3.3. Ca sử dụng: Luyện tập biểu hiện cảm xúc với Game Biểu Cảm .................................... 46 3.4. Ca sử dụng: Luyện tập nhận diện và ôn tập cảm xúc với Game Click ............................ 48 3.5 Ca sử dụng:  Tạo báo cáo .............................................................................................. 50 3.6 Ca sử dụng: Sử dụng Chatbot ........................................................................................ 52 **CHƯƠNG IV: THIẾT KẾ HỆ THỐNG ...................................................................................... 54** 1. Thiết kế mức cao của hệ thống .............................................................................................. 54 1.1 Kiến trúc hệ thống ......................................................................................................... 54 1.2 Các thành phần chính .................................................................................................... 55 1.3 Mối quan hệ tương tác ................................................................................................... 57 1.4 Quy trình xử lý dữ liệu .................................................................................................. 58 1.5 Thiết kế thuật toán chấm điểm và cơ chế Gamification .................................................. 60 1.5.1 Thuật toán chấm điểm .......................................................................................... 61 1.5.2 Luồng phản hồi Gamification: .............................................................................. 62 1.6 Thiết kế luồng xử lý Chatbot thông minh ....................................................................... 63 2. Thiết kế trải nghiệm người dùng ............................................................................................ 66 2.1 Chiến lược thị giác và giảm tải nhận thức ...................................................................... 66 2.2 Thiết kế tương tác tự nhiên (NUI).................................................................................. 66 2.3 Cơ chế phản hồi và kiến trúc vòng lặp khép kín ............................................................. 67 3. Thiết kế biểu đồ tuần tự ......................................................................................................... 67 3.1 Luồng xử lý học và ôn tập cảm xúc ............................................................................... 68 3.2 Luồng xử lý luyện tập biểu hiện cảm xúc....................................................................... 69 3.3 Luồng xử lý chơi game nhận diện cảm xúc .................................................................... 70 3.4 Luồng xử lý tạo báo cáo ................................................................................................ 71 3.5 Luồng xử lý sử dụng Chatbot ........................................................................................ 72 4. Thiết kế cơ sở dữ liệu ............................................................................................................ 72 5. Thiết kế API .......................................................................................................................... 75 5.1 Nhóm API Quản lý người dùng ..................................................................................... 76 5.2 Nhóm API trò chơi và tiến độ ........................................................................................ 77 5.3 Nhóm API game tương tác AI và Computer Vision ....................................................... 78 5.4 Nhóm API nội dung học tập và trợ lý ảo ........................................................................ 79 5.5 Nhóm API báo cáo và thống kê ..................................................................................... 79 5.6 Nhóm API quản trị hệ thống .......................................................................................... 80 **CHƯƠNG 5: CÀI ĐẶT VÀ KIỂM THỬ HỆ THỐNG ................................................................ 83** 1. Môi trường cài đặt và triển khai ............................................................................................. 83 1.1 Môi trường phía Server ................................................................................................. 83 1.2 Môi trường phía Client .................................................................................................. 84 1.3 Hệ quản trị cơ sở dữ liệu ............................................................................................... 84 

_8_ 

1.4 Quản lý cấu hình và bảo mật ......................................................................................... 84 1.5 Quy trình khởi chạy tự động .......................................................................................... 85 2. Kết quả cài đặt giao diện ....................................................................................................... 85 2.1 Màn hình các game “luyện tập biểu hiện cảm xúc” ........................................................ 85 2.1.1 Giao diện luyện tập biểu hiện cảm xúc ................................................................. 85 2.1.2 Các thành phần trải nghiệm người dùng chính ...................................................... 86 2.1.3 Nguyên tắc thiết kế trải nghiệm cho trẻ ASD ........................................................ 87 2.2 Màn hình “trò chơi nhận diện cảm xúc” ......................................................................... 88 2.2.1 Giao diện trò chơi nhận diện cảm xúc ................................................................... 88 2.2.2 Thiết kế nút bấm và minh họa .............................................................................. 88 2.3 Giao diện báo cáo .......................................................................................................... 89 3. Kiểm thử hệ thống ................................................................................................................. 90 3.1. Kiểm thử hiệu năng FPS và Latency ............................................................................. 90 3.2 Kiểm thử độ chính xác AI và phân tích nhầm lẫn ........................................................... 92 3.3 Đánh giá trải nghiệm người dùng .................................................................................. 94 **CHƯƠNG 6: KẾT LUẬN ............................................................................................................. 97** 1. Kết luận chung ...................................................................................................................... 97 2. Ý nghĩa khoa học và thực tiễn ............................................................................................... 98 3. Định hướng phát triển............................................................................................................ 99 **TÀI LIỆU THAM KHẢO ............................................................................................................101** 

_9_ 

## **CHƯƠNG I: ĐẶT VẤN ĐỀ** 

## **1. Đặt vấn đề** 

## **1.1 Bối cảnh và hiện trạng vấn đề** 

Trong bối cảnh y tế và giáo dục thế kỷ 21, bên cạnh những thành tựu về kiểm soát bệnh truyền nhiễm, thế giới đang đối mặt với sự gia tăng đáng báo động của các rối loạn phát triển thần kinh, trong đó phổ biến và thách thức nhất là rối loạn phổ tự kỷ (Autism Spectrum Disorder - ASD). Qn uy mô của vấn đề này đã được lượng hóa qua các báo cáo uy tín trên toàn cầu. Theo số liệu cập nhật từ Tổ chức Y tế Thế giới (WHO) tháng 9 năm 2025, vào năm  2021, cứ 127 người thì có khoảng 1 người mắc chứng tự kỷ [1]. Tuy nhiên, tại các quốc gia phát triển nơi có hệ thống sàng lọc y tế tiên tiến và quy trình chẩn đoán chặt chẽ như Hoa Kỳ, con số thực tế còn cao hơn nhiều. Báo cáo giám sát của trung tâm kiểm soát và phòng ngừa dịch bệnh Hoa Kỳ (Centers for Disease Control and Prevention - CDC) năm 2023 đã công bố một con số gây chấn động: Trong số trẻ em 8 tuổi vào năm 2022, tỷ lệ mắc ASD là 32,2 trên 1.000 trẻ (1/31), tăng đáng kể so với mức 23,0 trên 1.000 trẻ của năm 2018 (1/44) [2]. Sự gia tăng đột biến này cho thấy mức độ phổ biến thực tế của hội chứng này đang trở thành một áp lực lớn lên hệ thống an sinh xã hội. 

Hình 1.1. Biểu đồ thể hiện sự gia tăng tỷ lệ trẻ mắc ASD theo báo cáo của CDC giai đoạn 2000 - 2022 (Đơn vị: Số trẻ mắc ASD trên mỗi 1.000 trẻ được khảo sát) 

_10_ 

Tại Việt Nam, sự gia tăng tỷ lệ trẻ mắc ASD cũng diễn ra song hành với xu thế chung của thế giới, dù hiện tại chúng ta chưa có một cuộc điều tra dịch tễ học quy mô toàn quốc. Các dữ liệu lâm sàng từ các cơ sở y tế đầu ngành như bệnh viện nhi trung ương đã vẽ nên một bức tranh thực tế đáng lo ngại. Thống kê từ khoa tâm bệnh cho thấy số lượng trẻ đến khám và can thiệp các vấn đề liên quan đến chậm phát triển, rối loạn giao tiếp và tự kỷ đang tăng nhanh chóng qua từng năm. Cụ thể, riêng trong năm 2024, bệnh viện nhi trung ương đã tiếp nhận kỷ lục hơn 16.000 lượt trẻ đến khám với các chẩn đoán hoặc nghi ngờ liên quan đến rối loạn phổ tự kỷ [3]. 

Con số 16.000 lượt khám này không chỉ là một dữ liệu thống kê đơn thuần, mà nó phản ánh một cơn khát về nhu cầu hỗ trợ từ phía gia đình và xã hội. Thực trạng này đang tạo ra một áp lực khổng lồ, thậm chí là quá tải, lên hệ thống giáo dục đặc biệt vốn còn non trẻ và thiếu hụt nguồn lực chuyên môn tại Việt Nam. Hệ quả tất yếu là nhiều trẻ em đang bị bỏ lỡ giai đoạn vàng can thiệp (khoảng trước 8 tuổi) - khoảng thời gian não bộ còn mềm dẻo nhất để tiếp nhận các phương pháp trị liệu hiệu quả. 

Bên cạnh các con số thống kê, hiện trạng về mặt bệnh học cũng đặt ra nhiều thách thức, đặc biệt là bản chất của những khiếm khuyết cốt lõi liên quan đến nhận diện, xử lý và biểu đạt cảm xúc. Trong nhiều nghiên cứu gần đây, các nhà khoa học xem alexithymia là một cấu phần quan trọng giải thích những khó khăn cảm xúc thường thấy ở trẻ trong phổ tự kỷ. Thay vì coi đây chỉ là một hiện tượng đi kèm, một số công trình nhấn mạnh rằng alexithymia có thể vừa là nguyên nhân, vừa là hệ quả của các biểu hiện cảm xúc bất thường trong ASD. Điều này đặc biệt rõ khi xem xét tỷ lệ chồng lấn: theo tổng hợp của Poquérusse và cộng sự (2018) [4], khoảng một nửa số người trong phổ tự kỷ biểu hiện rõ nét các đặc điểm của alexithymia, bao gồm khó nhận biết cảm xúc, khó phân biệt giữa cảm xúc và tín hiệu cơ thể, và hạn chế trong khả năng mô tả trải nghiệm cảm xúc bằng lời. 

Song song với hạn chế trong nhận thức nội thân, các nghiên cứu về quá trình xử lý tín hiệu khuôn mặt ở trẻ ASD cho thấy một kiểu chiến lược nhìn khác biệt đáng kể so với trẻ phát triển bình thường. Những cá nhân không thuộc phổ tự kỷ thường sử dụng mô hình quan sát hình tam giác ngược, tập trung chủ yếu vào hai mắt và miệng, để giải mã sắc thái cảm xúc. Tuy nhiên, nhiều trẻ ASD lại có xu hướng tránh nhìn vào mắt và chuyển sự chú ý sang các vùng ngoại vi hoặc miệng. Poquérusse và cộng sự trích dẫn nhiều công trình cho thấy sự tránh né ánh mắt làm suy giảm chất lượng xử lý cảm xúc, bởi vùng mắt cung cấp tín hiệu chính mang tính phân biệt giữa các cảm xúc cơ bản lẫn cảm xúc phức tạp. Một số nghiên cứu thần kinh còn chỉ ra rằng vùng não liên quan đến xử lý biểu cảm, bao gồm amygdala, insula và vỏ trước trán, 

_11_ 

phản ứng khác biệt ở trẻ ASD, làm giảm khả năng gắn kết giữa dấu hiệu khuôn mặt và ý nghĩa cảm xúc tương ứng. 

## **1.2 Tính cấp thiết của đề tài** 

Sự kết hợp giữa hai cơ chế trên: khó nhận biết cảm xúc từ bên trong và khó giải mã cảm xúc từ bên ngoài đã tạo ra một vòng lặp bất lợi khiến trẻ gặp khó khăn trong giao tiếp xã hội và điều tiết cảm xúc. Khi trẻ không hiểu được trạng thái nội thân của mình, chúng không thể phản hồi phù hợp khi đối diện tình huống cảm xúc. Đồng thời, việc không đọc được biểu cảm người khác ngăn cản trẻ học quy luật xã hội thông qua quan sát, vốn là cơ chế học phổ biến ở trẻ phát triển bình thường. Các tác giả trong nghiên cứu nhấn mạnh rằng chính sự giao thoa này giải thích tại sao alexithymia là một yếu tố then chốt cần được chú ý khi xây dựng can thiệp cho trẻ ASD: muốn cải thiện năng lực xử lý cảm xúc, cần tác động đồng thời vào khả năng nhận biết nội tâm, khả năng giải mã tín hiệu khuôn mặt và các chiến lược điều tiết cảm xúc bền vững hơn. 

Thiếu hụt trong khả năng nhận diện và diễn giải cảm xúc dẫn đến nhiều hệ quả xã hội nghiêm trọng: trẻ khó tạo lập quan hệ bạn bè, ít được hiểu và dễ bị hiểu lầm, và nguy cơ bị bắt nạt học đường cao hơn nhiều so với nhóm trẻ điển hình. Về dài hạn, điều này ảnh hưởng trực tiếp đến chất lượng sống, sự độc lập và cơ hội học tập, nghề nghiệp của trẻ trong tương lai. Trí tuệ cảm xúc (EQ), nền tảng của mọi tương tác xã hội là lĩnh vực mà trẻ ASD gặp khó khăn nghiêm trọng, tạo nên rào cản lớn nhất cho sự hòa nhập. 

Trong bối cảnh đó, việc phát triển các công cụ hỗ trợ trẻ học nhận diện và biểu đạt cảm xúc trở thành một yêu cầu mang tính cấp thiết. Đây không chỉ là vấn đề giáo dục đặc biệt mà còn là vấn đề an sinh xã hội. Sự xuất hiện của Trí tuệ nhân tạo (AI) và công nghệ Thị giác máy tính (Computer Vision) mang đến khả năng tái cấu trúc lại cách trẻ ASD luyện tập kỹ năng cảm xúc. Những công nghệ này cho phép xây dựng môi trường mô phỏng cảm xúc có tính trực quan, phản hồi thời gian thực và không gây áp lực xã hội, điều mà con người khó có thể cung cấp liên tục. 

## **2. Các giải pháp đã có và hạn chế** 

Để định hình rõ hướng phát triển của đề tài, nhóm nghiên cứu tiến hành khảo sát hai nhóm giải pháp phổ biến hiện nay: các phương pháp can thiệp truyền thống trong giáo dục đặc biệt và các ứng dụng công nghệ hỗ trợ trẻ ASD đang có trên thị trường. Việc phân tích hai nhóm giải pháp này giúp xác định những hạn chế cốt lõi mà hệ thống cần giải quyết. 

_12_ 

## **2.1 Các phương pháp can thiệp truyền thống** 

Trong lĩnh vực giáo dục đặc biệt truyền thống, đặc biệt là đối với trẻ ASD, việc dạy trẻ nhận diện và biểu đạt cảm xúc từ lâu đã dựa trên hai nhóm kỹ thuật chính: học qua thẻ tranh và tập luyện thông qua phản hồi gương (Mirror Feedback). Chúng được xem như nền tảng của các chương trình can thiệp hành vi từ hàng chục năm nay. Tuy nhiên, khi nhu cầu can thiệp mở rộng và yêu cầu đánh giá khách quan ngày càng cao, những phương pháp này bộc lộ những giới hạn mang tính bản chất, cho thấy chúng khó đáp ứng trọn vẹn bài toán của giáo dục hiện đại. 

Ở phương pháp thẻ tranh (PECS/Flashcards), vấn đề không chỉ nằm ở hình thức dữ liệu, tức việc sử dụng hình ảnh tĩnh, mà ở cách não bộ của trẻ ASD tiếp nhận thông tin. Nhiều nghiên cứu chỉ ra rằng trẻ ASD gặp khó khăn trong việc khái quát hóa. Khi trẻ nhìn vào một bức ảnh cụ thể có biểu cảm vui, chúng thường ghi nhớ đặc điểm cơ mặt đúng của tấm ảnh đó thay vì hiểu khái niệm vui là dãy trạng thái có thể biến thiên theo độ cong môi, độ mở mí mắt, hoặc hướng nghiêng đầu. Điều này khiến việc học từ thẻ tranh trở nên phiến diện: trẻ ghi nhớ hình mẫu cố định nhưng không chuyển hóa được sang các tình huống thực tế, nơi biểu cảm thay đổi liên tục theo ngữ cảnh, cường độ cảm xúc và đặc điểm từng người. Do đó, khi gặp người thật với biểu cảm vui nhưng cười nhẹ, hay cười mím, trẻ có thể hoàn toàn không nhận ra cảm xúc đó. Thực tiễn giáo dục cho thấy điều này dẫn đến tình trạng trẻ có điểm số rất tốt trong các bài kiểm tra dạng thẻ nhưng lại thất bại trong giao tiếp đời thường, phản ánh sự lệch pha giữa kiến thức được dạy và năng lực thực sự có thể áp dụng. 

Phương pháp phản hồi qua gương được xem như bước tiến so với thẻ tranh vì cho phép trẻ quan sát khuôn mặt thật của chính mình trong quá trình luyện tập. Tuy nhiên, tính trực quan này lại đi kèm một loạt hạn chế về tính chủ quan, chi phí và khả năng chuẩn hóa. Bài tập qua gương yêu cầu sự hiện diện liên tục của người hướng dẫn để diễn giải, mô phỏng và đánh giá biểu cảm của trẻ. Việc nhận định trẻ đã thể hiện đúng hay chưa phụ thuộc vào cảm quan của chuyên gia, vốn có thể thay đổi theo kinh nghiệm, độ tập trung hoặc cách hiểu về mức độ đúng của từng cảm xúc. Không có bất kỳ tham số định lượng nào để mô tả độ mở miệng, hướng chuyển động của lông mày hay độ co cơ vùng mắt, những yếu tố quan trọng trong biểu đạt cảm xúc. Điều này tạo ra tình trạng đánh giá thiếu nhất quán giữa các buổi học, giữa các chuyên gia khác nhau, hoặc giữa các trung tâm can thiệp. Hơn nữa, mô hình tương tác 1:1 khiến phương pháp này trở nên tốn kém và khó tiếp cận với các gia đình có nguồn lực hạn chế. Trong nhiều trường hợp, thời lượng can thiệp phải rút ngắn hoặc tần suất giảm xuống, làm ảnh hưởng trực tiếp đến hiệu quả lâu dài của trẻ. 

_13_ 

Một vấn đề khác ít được chú ý nhưng có tác động lớn là sự thiếu vắng cơ chế phản hồi ngay lập tức. Trong khi việc học biểu cảm đòi hỏi trẻ phải nhận được tín hiệu phản hồi tức thời để điều chỉnh nhóm cơ mặt, việc phụ thuộc vào người hướng dẫn khiến tốc độ phản hồi bị gián đoạn. Khi trẻ mất đi sự kết nối giữa hành động và hệ quả ngay lập tức, quá trình học bị chậm và dễ gây chán nản. Đây là điểm mà các hệ thống số hóa có khả năng vượt trội nhưng phương pháp truyền thống gần như không thể giải quyết. 

Nhìn tổng thể, các phương pháp truyền thống vẫn giữ giá trị nền tảng, nhất là trong các hoạt động trị liệu có hướng dẫn. Tuy nhiên, khi nhu cầu can thiệp lan rộng, khi phụ huynh cần theo dõi tiến trình khách quan và khi trẻ cần môi trường luyện tập ổn định với phản hồi tức thì, những mô hình cũ không còn đáp ứng đầy đủ. Chúng thiếu dữ liệu định lượng, thiếu tính linh hoạt trong triển khai, thiếu khả năng duy trì động lực cho trẻ và không tạo được cầu nối giữa bài tập và đời sống thực. Chính những hạn chế mang tính hệ thống này làm nổi bật nhu cầu cần có các giải pháp công nghệ mới, những giải pháp có khả năng mở rộng, tự động hóa và cung cấp đánh giá dựa trên dữ liệu thay vì chỉ dựa vào quan sát cảm tính của con người. 

## **2.2 Các giải pháp công nghệ hiện có** 

Trong những năm gần đây, sự phát triển của công nghệ giáo dục và trí tuệ nhân tạo đã thúc đẩy sự ra đời của nhiều ứng dụng hỗ trợ trẻ rối loạn phổ tự kỷ (ASD). Các giải pháp này trải rộng từ học nhận biết cảm xúc, điều tiết hành vi đến hỗ trợ giao tiếp xã hội. Tuy nhiên, khi phân tích sâu theo mục tiêu can thiệp cảm xúc một cách toàn diện, có thể nhận thấy các hệ thống hiện tại vẫn mang tính rời rạc. Mỗi nền tảng chỉ giải quyết một lát cắt nhỏ của bài toán, chưa hình thành được một lộ trình khép kín từ nhận diện, hiểu đến biểu đạt cảm xúc. 

Ở thị trường quốc tế, nhiều ứng dụng được xây dựng bài bản, có cơ sở tâm lý học rõ ràng và áp dụng các cơ chế trò chơi để duy trì động lực cho trẻ. Trong khi đó, các giải pháp trong nước chủ yếu tập trung vào nội dung giáo dục sớm, sàng lọc hoặc cung cấp kiến thức cho phụ huynh, ít nền tảng hướng trực tiếp tới việc luyện tập kỹ năng cho trẻ ASD. Dựa trên tính năng và mục tiêu can thiệp, các giải pháp hiện có được phân loại thành ba nhóm chính: 

## **2.2.1 Nhóm ứng dụng nhận thức cảm xúc** 

Đại diện tiêu biểu cho nhóm này là **Otsimo** và **MITA (Mental Imagery Therapy for Autism)** . Các ứng dụng này được thiết kế nhằm giúp trẻ làm quen với khái niệm cảm xúc thông qua hình ảnh, biểu tượng hoặc các bài tập lựa chọn đáp án (trắc nghiệm, ghép hình). Nội dung thường được tổ chức theo cấp độ, bắt đầu từ các cảm xúc cơ bản như vui, buồn, giận, sợ và dần mở rộng sang các trạng thái phức tạp hơn. 

_14_ 

- **Ưu điểm:** Khả năng xây dựng nền tảng kiến thức cảm xúc vững chắc. Trẻ học cách liên kết một nhãn cảm xúc với một biểu hiện cụ thể, từ đó cải thiện vốn từ vựng. Với giao diện đơn giản và lộ trình rõ ràng, nhóm này đặc biệt phù hợp với giai đoạn đầu can thiệp, khi trẻ còn hạn chế về khả năng tập trung. 

- **Hạn chế:** Tính chất tương tác một chiều. Trẻ chủ yếu quan sát và lựa chọn thụ động, không cần sử dụng chính khuôn mặt hay cơ thể của mình để thể hiện cảm xúc. Điều này dẫn đến khoảng cách lớn giữa nhận thức lý thuyết và hành vi thực tế. Trẻ có thể trả lời đúng trên màn hình nhưng gặp khó khăn khi tái hiện cảm xúc đó trong giao tiếp đời sống. 

## **2.2.2 Nhóm ứng dụng điều tiết cảm xúc** 

Nhóm thứ hai tập trung vào việc hỗ trợ trẻ kiểm soát trạng thái cảm xúc nội tâm, tiêu biểu là **Wisdom: The World of Emotions** và **Mightier** . Các nền tảng này thường xây dựng các kịch bản tương tác hoặc trò chơi có lồng ghép phản hồi sinh lý (biofeedback), nhằm giúp trẻ nhận biết khi nào mình đang căng thẳng, lo âu hoặc mất kiểm soát. 

- **Ưu điểm:** Hỗ trợ hiệu quả trong việc điều tiết hành vi, đặc biệt trong các tình huống bùng nổ cảm xúc. Thông qua cơ chế phản hồi liên tục, trẻ dần hình thành nhận thức về trạng thái bên trong và học các kỹ thuật làm dịu bản thân (thở sâu, trấn tĩnh). 

- **Hạn chế:** Nhóm giải pháp này chủ yếu tập trung vào phần "bên trong" (nội tâm) mà chưa giải quyết được phần "bên ngoài" (biểu đạt). Trẻ có thể học cách bình tĩnh hơn, nhưng không được hướng dẫn cụ thể cách biểu hiện cảm xúc đó ra khuôn mặt để người khác hiểu. Việc thiếu công nghệ phân tích biểu cảm khiến hệ thống không thể đánh giá hay điều chỉnh nét mặt cho trẻ. 

## **2.2.3 Nhóm ứng dụng có yếu tố biểu đạt và tương tác nâng cao** 

Nhóm thứ ba bao gồm các nền tảng tiếp cận gần hơn với bài toán giao tiếp và biểu đạt, như **InnerVoice** , **The Social Express** (quốc tế) và **A365** (Việt Nam). Các ứng dụng này chú trọng tới giao tiếp xã hội, bối cảnh tương tác và hỗ trợ trẻ diễn đạt suy nghĩ thông qua hình ảnh, giọng nói hoặc kịch bản mô phỏng. 

- **Ưu điểm:** Vượt qua mức học thụ động, hướng tới việc đặt trẻ vào các tình huống giao tiếp gần với đời thực. Một số ứng dụng khuyến khích trẻ nhìn vào màn hình, phản hồi theo ngữ cảnh, giúp trẻ hình dung rõ hơn mối liên hệ giữa cảm xúc, hành vi và phản ứng xã hội. 

_15_ 

## ● **Hạn chế:** 

- **Về công nghệ lõi:** InnerVoice chủ yếu phục vụ giao tiếp thay thế (AAC) hơn là luyện tập cơ mặt. The Social Express thiên về giải quyết tình huống xã hội qua hoạt hình. 

- **Tại Việt Nam:** Nền tảng A365 có ưu điểm lớn về nội dung tiếng Việt chuyên sâu và tính phù hợp văn hóa, tuy nhiên hệ thống tập trung nhiều vào việc hỗ trợ phụ huynh sàng lọc và theo dõi sự phát triển. A365 chưa tích hợp khả năng phân tích biểu cảm thời gian thực (Computer Vision) để trẻ có thể tự luyện tập. Việc đánh giá mức độ biểu đạt của trẻ vẫn phụ thuộc hoàn toàn vào quan sát chủ quan của người lớn. 

## **2.2.4 Tổng kết** 

Qua phân tích chi tiết ba nhóm giải pháp trên, bức tranh về công nghệ hỗ trợ trẻ ASD hiện nay hiện ra với những ưu điểm và hạn chế rõ rệt. Nhóm nhận thức giúp trẻ xây dựng khái niệm nhưng thiếu sự thực hành vận động; nhóm điều tiết hỗ trợ quản lý nội tâm nhưng bỏ ngỏ kỹ năng biểu đạt ra bên ngoài; trong khi nhóm tương tác xã hội lại gặp rào cản lớn về công nghệ lõi trong việc đánh giá tự động. 

Bên cạnh các yếu tố kỹ thuật, **rào cản ngôn ngữ** đang nổi lên như một thách thức lớn ngăn cản trẻ em Việt Nam tiếp cận các công nghệ tiên tiến. Hầu hết các ứng dụng tích hợp AI chất lượng cao (như Otsimo, InnerVoice) đều sử dụng tiếng Anh làm ngôn ngữ chính. Đối với trẻ ASD, nhóm đối tượng vốn đã gặp khó khăn trong thụ đắc ngôn ngữ mẹ đẻ, việc phải tương tác với một giao diện và giọng nói tiếng nước ngoài tạo ra "rào cản kép", làm giảm đáng kể hiệu quả can thiệp. Trong khi đó, các ứng dụng thuần Việt hiện có lại chưa được đầu tư đúng mức về công nghệ AI để phân tích biểu cảm. 

Đặc biệt, tại thị trường Việt Nam hiện **vẫn chưa tồn tại** một nền tảng Web hoặc ứng dụng tiếng Việt miễn phí nào tích hợp công nghệ phân tích biểu cảm khuôn mặt thời gian thực (Computer Vision). Khoảng trống này, nơi giao thoa giữa nhu cầu công nghệ cao và nhu cầu bản địa hóa, chính là cơ sở thực tiễn quan trọng để đề tài đề xuất và xây dựng **Emo Garden** . Đây sẽ là một hệ thống tương tác hai chiều, sử dụng ngôn ngữ tiếng Việt, giúp kết nối chặt chẽ giữa nhận thức, điều tiết và biểu đạt cảm xúc trong một môi trường an toàn và dễ tiếp cận. 

_16_ 

## **2.3 Phân tích khoảng trống nghiên cứu** 

Từ bức tranh toàn cảnh về các giải pháp hiện hữu, nhóm nghiên cứu đã tổng hợp và nhận diện được **bốn khoảng trống lớn** mang tính hệ thống mà các sản phẩm trên thị trường chưa thể lấp đầy. Những khoảng trống này tạo nên rào cản lớn trong việc nâng cao hiệu quả can thiệp cảm xúc cho trẻ ASD tại Việt Nam. 

**Thứ nhất là sự bất đối xứng trong cơ chế tương tác.** Các công cụ hiện nay đang tập trung quá nhiều vào kỹ năng nhận diện thụ động, nơi trẻ chỉ đóng vai trò người quan sát và lựa chọn đáp án có sẵn (chạm, vuốt). Điều này vô tình bỏ ngỏ kỹ năng biểu đạt chủ động, yếu tố then chốt để trẻ giao tiếp với thế giới. Một hệ thống hiệu quả cần chuyển dịch từ thao tác tay sang tương tác tự nhiên ((Natural User Interface - NUI) bằng khuôn mặt. Hệ thống phải có khả năng phản hồi dựa trên chính những vận động cơ mặt của trẻ, tạo ra môi trường thực hành thời gian thực thay vì chỉ ghi nhận đáp án đúng/sai cơ học. 

**Thứ hai là khoảng trống về sự tương thích văn hóa và ngôn ngữ.** Đây là rào cản lớn nhất đối với người dùng trong nước. Các giải pháp quốc tế dù hiện đại nhưng thường sử dụng các kịch bản xã hội phương Tây và ngôn ngữ tiếng Anh, không phù hợp với bối cảnh giao tiếp của trẻ em Việt. Ngược lại, các ứng dụng trong nước dù có lợi thế ngôn ngữ nhưng lại thiếu vắng công nghệ lõi. Sự thiếu hụt một giải pháp "công nghệ quốc tế - nội dung bản địa" khiến phụ huynh Việt Nam buộc phải lựa chọn giữa công nghệ tốt (nhưng rào cản ngôn ngữ) hoặc nội dung gần gũi (nhưng công nghệ lạc hậu). 

**Thứ ba là rào cản về công nghệ triển khai.** Hiện tồn tại sự phân cực rõ rệt: các ứng dụng phân tích hành vi chính xác thường yêu cầu phần cứng chuyên dụng (camera 3D, cảm biến nhịp tim) hoặc chạy trên hệ sinh thái đóng đắt đỏ (iOS); ngược lại, các web phổ thông lại thiếu vắng AI. Chưa có một giải pháp Web-based nào giải quyết thành công bài toán cân bằng giữa hiệu năng và tính tiếp cận: chạy được mô hình Deep Learning ngay trên trình duyệt với độ trễ thấp, không đòi hỏi thiết bị cấu hình cao và tích hợp sẵn trợ lý ảo (Chatbot) để hỗ trợ trẻ ngay khi gặp khó khăn. 

**Thứ tư là sự thiếu hụt dữ liệu định lượng khách quan.** Trong các mô hình hiện tại, việc đánh giá trẻ phần lớn dựa vào cảm nhận chủ quan của phụ huynh, giáo viên. Các chỉ số quan trọng như thời gian phản hồi (thể hiện sự thành thạo), tỷ lệ chính xác theo từng loại cảm xúc hay xu hướng thay đổi hành vi theo thời gian chưa được số hóa. Việc thiếu vắng dữ liệu định lượng làm giảm tính thuyết phục khoa học của quá trình can thiệp. 

_17_ 

Tổng hợp lại, việc giải quyết đồng thời bốn khoảng trống về **tương tác, ngôn ngữ, công nghệ và dữ liệu** chính là động lực để nhóm nghiên cứu phát triển đề tài này. 

## **3. Đề xuất giải pháp: Hệ thống Web tương tác đa chiều** 

Nhằm giải quyết các khoảng trống đã nêu, nhóm đề xuất xây dựng một hệ thống Web hỗ trợ trẻ rối loạn phổ tự kỷ (ASD) luyện tập cảm xúc theo mô hình “học tập, ôn luyện, đánh giá” khép kín, được tối ưu hóa hoàn toàn cho người dùng Việt Nam. 

Điểm cốt lõi của giải pháp là chuyển từ học thụ động sang tương tác đa chiều: trẻ vừa **nhận diện cảm xúc** (qua Game Click), vừa **biểu đạt cảm xúc** (qua Game CV - Camera), và toàn bộ quá trình được hỗ trợ bởi AI tiếng Việt. Giải pháp được thiết kế theo 3 trụ cột chính: 

## **3.1 Tương tác tự nhiên (NUI) qua Camera** 

Tại module Game Computer Vision (Game CV), hệ thống sử dụng webcam để tạo trải nghiệm “soi gương kỹ thuật số”. Trẻ nhìn thấy mình trên màn hình và tập biểu đạt cảm xúc (Vui, Buồn, Giận, Sợ, Ngạc nhiên, Ghê tởm) theo các tình huống bằng tiếng Việt. 

- **Công nghệ:** Triển khai thư viện face-api.js chạy trực tiếp trên trình duyệt client. Điều này giúp giảm độ trễ tối đa, đảm bảo tính riêng tư (không gửi video lên server) và không yêu cầu phần cứng đắt tiền. 

- **Phản hồi:** Hệ thống cung cấp phản hồi tức thì bằng các tín hiệu trực quan (Emoji, thang đo độ tin cậy %, đèn trạng thái), giúp trẻ tự điều chỉnh cơ mặt. 

## **3.2 Định lượng hóa đánh giá và số hóa dữ liệu** 

Thay vì đánh giá cảm tính, hệ thống ghi nhận các chỉ số đo lường cụ thể: số lần đúng/sai, thời gian phản hồi, cảm xúc mục tiêu so với cảm xúc thực tế, và điểm số tin cậy (0-100). 

- **Công nghệ:** Dữ liệu được xử lý qua Backend FastAPI và lưu trữ tập trung tại SQL Server. 

- **Giá trị mang lại:** Tạo nền tảng cho các báo cáo tiến độ chi tiết, giúp phụ huynh/giáo viên theo dõi sự phát triển của trẻ dựa trên con số thực tế. 

## **3.3 Bền vững động lực và hỗ trợ bản địa hóa** 

- **Gamification khoan dung:** Hệ thống loại bỏ khái niệm "thua cuộc" (Game Over) gây lo âu. Thay vào đó là cơ chế phản hồi tích cực, gợi ý (hint) và cơ chế "Góc học tập" (tự động hiện video hướng dẫn khi sai nhiều lần). 

_18_ 

- **Trợ lý ảo AI tiếng Việt:** Tích hợp Chatbot (dựa trên Google Gemini) đóng vai trò "người bạn đồng hành". Chatbot được huấn luyện để hiểu và phản hồi bằng tiếng Việt tự nhiên, giúp giải thích luật chơi, hướng dẫn trẻ cách biểu lộ cảm xúc và hỗ trợ giải quyết các lỗi thao tác trong quá trình sử dụng web. 

Với cách tiếp cận này, EmoGarden không chỉ là một công cụ công nghệ, mà là một giải pháp can thiệp mang tính nhân văn, xóa bỏ rào cản ngôn ngữ để đưa công nghệ hỗ trợ đến gần hơn với trẻ em tự kỷ tại Việt Nam. 

## **4. Kết quả thử nghiệm và đánh giá sơ bộ** 

Để kiểm chứng tính đúng đắn của giải pháp đề xuất, nhóm nghiên cứu đã hoàn thiện phiên bản khả dụng tối thiểu (MVP) và tiến hành các đợt thử nghiệm nội bộ trên môi trường triển khai thực tế (trình duyệt Chrome, Edge, Cốc cốc, laptop phổ thông). Kết quả cho thấy hệ thống đáp ứng tốt yêu cầu về tính khả thi kỹ thuật và trải nghiệm người dùng. 

## **Về hiệu năng** 

Trong điều kiện thử nghiệm với laptop cấu hình phổ thông (Core i5, RAM 8GB, không GPU rời), module nhận diện biểu cảm chạy ổn định với tốc độ xử lý ở mức khoảng 12 - 20 FPS và độ trễ phản hồi giao diện xấp xỉ 150 - 300 ms (phụ thuộc ánh sáng và chất lượng webcam). Mức phản hồi này đảm bảo vòng lặp tương tác đủ nhanh để người chơi điều chỉnh biểu cảm theo phản hồi trực quan. 

## **Về thuật toán** 

Hệ thống hướng tới mục tiêu hỗ trợ luyện tập (feedback tức thời) hơn là chẩn đoán y khoa. Trong thử nghiệm nội bộ với các tình huống ánh sáng tiêu chuẩn và khuôn mặt nằm trọn trong khung hình, độ nhận diện đúng cảm xúc mục tiêu đạt khoảng 85 - 90% đối với 6 cảm xúc cơ bản; các lỗi chủ yếu xuất hiện khi góc mặt lệch, ánh sáng yếu hoặc biểu cảm cường độ thấp. 

## **Về trải nghiệm người dùng** 

Quan sát thử nghiệm trên một nhóm nhỏ người dùng (phạm vi nội bộ) cho thấy người chơi có thể làm quen nhanh với cơ chế “gương camera” và hiểu được tín hiệu phản hồi (đèn trạng thái, phần trăm tin cậy) sau vài phút hướng dẫn. So với bài tập tĩnh truyền thống, cơ chế phản hồi thời gian thực giúp tăng mức độ tương tác chủ động và duy trì chú ý tốt hơn trong suốt phiên luyện tập. 

_19_ 

## **5. Cấu trúc báo cáo** 

Báo cáo được tổ chức thành 06 chương, đi từ việc xác định vấn đề thực tiễn, xây dựng cơ sở lý luận đến thu thập, phân tích yêu cầu rồi thiết kế giải pháp và kiểm chứng kết quả. Nội dung chi tiết của từng chương được trình bày như sau: 

## **Chương 1: Đặt vấn đề** 

Chương mở đầu thiết lập bối cảnh nghiên cứu bằng việc phân tích thực trạng gia tăng của trẻ rối loạn phổ tự kỷ và những thách thức cốt lõi trong can thiệp kỹ năng cảm xúc. Nội dung tập trung làm rõ các hạn chế của phương pháp truyền thống cũng như các giải pháp công nghệ hiện hành để xác định chính xác khoảng trống nghiên cứu. Từ đó, báo cáo đề xuất giải pháp hệ thống Web tương tác tích hợp AI như một hướng tiếp cận mới nhằm giải quyết đồng thời ba bài toán về tương tác, công nghệ và dữ liệu, đồng thời tóm tắt những kết quả sơ bộ khẳng định tính khả thi của dự án. 

## **Chương 2: Kiến thức nền tảng** 

Chương này xây dựng cơ sở lý luận cho toàn bộ hệ thống thông qua sự giao thoa giữa tâm lý học và khoa học máy tính. Báo cáo phân tích các đặc điểm nhận thức, hành vi đặc thù của trẻ ASD và lý thuyết 6 cảm xúc cơ bản để làm tiền đề cho các quyết định thiết kế trải nghiệm (giảm tải nhận thức, phản hồi khoan dung, tương tác ổn định). Song song với đó, chương trình bày nền tảng công nghệ phục vụ triển khai hệ thống: nhận diện biểu cảm khuôn mặt (FER) theo hướng suy luận trên thiết bị người dùng bằng face-api.js (mô hình học sâu, CNN đã huấn luyện sẵn, chạy trên trình duyệt), kiến trúc Backend FastAPI để cung cấp dữ liệu màn chơi, quản lý phiên chơi và lưu kết quả, tiến độ vào cơ sở dữ liệu, cùng cơ chế tích hợp mô hình ngôn ngữ lớn (Gemini) cho chatbot hỗ trợ hướng dẫn và giải đáp trong phạm vi hệ thống. Các nội dung trên là cơ sở khoa học cho việc lựa chọn công nghệ theo tiêu chí: độ trễ thấp, dễ triển khai trên thiết bị phổ thông và phù hợp nguyên tắc bảo vệ dữ liệu nhạy cảm. 

## **Chương 3: Phân tích và đặc tả yêu cầu** 

Tiếp nối nền tảng lý thuyết, chương 3 thực hiện việc chuyển hóa các nguyên tắc tâm lý học thành các đặc tả kỹ thuật cụ thể. Trọng tâm của chương là xác định chân dung người dùng và xây dựng các kịch bản tương tác phù hợp với năng lực hành vi của trẻ. Báo cáo mô tả chi tiết hệ thống các yêu cầu chức năng, đồng thời phân tích sâu các ràng buộc phi chức năng khắt khe về độ trễ, tính nhất quán của giao diện và bảo mật dữ liệu trẻ em. Các biểu đồ ca sử dụng cũng được thiết lập nhằm định hình rõ luồng nghiệp vụ và phạm vi hoạt động của hệ thống. 

_20_ 

## **Chương 4: Thiết kế hệ thống** 

Từ các yêu cầu đã phân tích, chương 4 trình bày kiến trúc tổng thể của giải pháp theo mô hình Client - Server tối ưu cho nền tảng Web. Nội dung chương mô tả chi tiết quy trình xử lý dữ liệu AI khép kín từ đầu vào camera đến phản hồi giao diện, mô hình ngôn ngữ lớn (Large Language Models - LLM) cho chatbot, thiết kế cơ sở dữ liệu phục vụ lưu trữ tiến độ và cấu trúc thuật toán Gamification. Đặc biệt, phần thiết kế trải nghiệm người dùng (UX) được chú trọng phân tích để chứng minh sự tuân thủ các nguyên tắc giảm tải nhận thức và tương tác tự nhiên dành cho đối tượng người dùng đặc biệt. 

## **Chương 5: Cài đặt và kiểm thử hệ thống** 

Chương này trình bày quá trình hiện thực hóa các thiết kế thành sản phẩm phần mềm cụ thể. Nội dung bao gồm mô tả chi tiết việc xây dựng các màn hình chức năng trọng yếu như hệ thống trò chơi nhận diện, biểu hiện cảm xúc, chatbot hỗ trợ và bảng báo cáo tiến độ. Phần quan trọng nhất của chương là các kịch bản kiểm thử hệ thống, bao gồm đánh giá hiệu năng kỹ thuật (tốc độ xử lý, độ trễ), đo lường độ chính xác của mô hình trên tập dữ liệu trẻ em và đánh giá trải nghiệm người dùng thông qua quan sát thực tế, nhằm cung cấp bằng chứng định lượng cho hiệu quả của giải pháp. 

## **Chương 6: Kết luận** 

Chương cuối cùng tổng kết lại toàn bộ quá trình nghiên cứu, đối chiếu các kết quả đạt được với mục tiêu đặt ra ban đầu. Báo cáo cũng nhìn nhận khách quan những hạn chế còn tồn tại về mặt công nghệ hoặc phạm vi triển khai. Trên cơ sở đó, đề xuất các định hướng phát triển mở rộng trong tương lai như tích hợp đa phương thức tương tác hay cá nhân hóa bằng AI thích ứng, khẳng định ý nghĩa khoa học và giá trị thực tiễn của đề tài trong bối cảnh giáo dục đặc biệt tại Việt Nam. 

_21_ 

## **CHƯƠNG 2: KIẾN THỨC NỀN TẢNG** 

## **1. Cơ sở lý luận về rối loạn phổ tự kỷ** 

Việc phát triển một hệ thống hỗ trợ trẻ rối loạn phổ tự kỷ (ASD) không đơn thuần là giải quyết các bài toán kỹ thuật về lập trình, mà về bản chất, đây là một thách thức phức tạp trong thiết kế trải nghiệm người dùng (UX Design). Để đảm bảo sản phẩm đạt được tính khả dụng cao và mang lại hiệu quả giáo dục thực tế, nhóm nghiên cứu đã tiếp cận vấn đề từ góc độ tâm lý học thần kinh. Dựa trên các tiêu chuẩn chẩn đoán lâm sàng DSM-5 và các nghiên cứu hành vi uy tín, việc phân tích sâu sắc các đặc điểm nhận thức của trẻ là bước đi tiên quyết. Những cơ sở lý luận này đóng vai trò là kim chỉ nam để xác lập các nguyên lý thiết kế giao diện, nhằm kiến tạo sự khớp nối tối ưu giữa mô hình tư duy đặc thù của trẻ và cơ chế vận hành của hệ thống công nghệ. 

## **1.1 Đặc điểm tâm lý học thần kinh và hệ quả thiết kế** 

Thông qua quá trình tổng hợp y văn và quan sát thực nghiệm, nhóm nghiên cứu nhận diện ba đặc điểm nhận thức cốt lõi chi phối hành vi tương tác của trẻ ASD, từ đó dẫn xuất ra các yêu cầu thiết kế tương ứng. 

**Đặc điểm nổi bật đầu tiên là tư duy trực quan** . Theo công trình nghiên cứu kinh điển của tiến sĩ Temple Grandin, não bộ của người tự kỷ sở hữu khả năng xử lý thông tin thị giác vượt trội hơn hẳn so với kênh ngôn ngữ hoặc thính giác. Đối với nhóm đối tượng này, ngôn ngữ văn bản thường là một dạng mã hóa trừu tượng, phức tạp và khó giải mã, trong khi hình ảnh lại là dữ liệu cụ thể, trực tiếp và dễ tiếp nhận. Đặc điểm này lý giải cho sự hạn chế của các phương pháp giáo dục truyền thống nặng về lời nói và đặt ra yêu cầu cấp thiết cho việc trực quan hóa thông tin trong thiết kế giao diện. Hệ thống cần giảm thiểu tối đa gánh nặng nhận thức bằng cách hạn chế văn bản, thay thế các chỉ dẫn bằng hệ thống biểu tượng và hình ảnh động. Các thành phần tương tác như nút bấm cần được thiết kế với kích thước lớn, màu sắc nổi bật tuân theo định luật Fitts trong HCI, giúp trẻ dễ dàng thao tác và nắm bắt nhiệm vụ thông qua cơ chế bắt chước tự nhiên mà không cần đọc hiểu phức tạp. 

**Đặc điểm thứ hai cần lưu ý là thuyết liên kết trung tâm yếu (Weak Central Coherence)** . Lý thuyết này chỉ ra xu hướng xử lý thông tin cục bộ thay vì toàn thể ở trẻ tự kỷ. Trong giao tiếp mặt đối mặt, sự chú ý của trẻ thường bị phân mảnh, dễ bị cuốn hút bởi các chi tiết nhỏ lẻ, tách biệt như một nốt ruồi hay chuyển động của tóc mà bỏ qua cấu trúc tổng thể của khuôn mặt người đối diện. Sự lệch lạc trong chú ý thị giác này là nguyên nhân chính dẫn đến 

_22_ 

thất bại trong việc nhận diện trạng thái cảm xúc. Để khắc phục, giao diện ứng dụng buộc phải tuân thủ nghiêm ngặt nguyên tắc tối giản. Mọi yếu tố trang trí rườm rà hay các rác thị giác có nguy cơ gây xao nhãng đều phải bị loại bỏ. Quan trọng hơn, hệ thống cần áp dụng kỹ thuật nổi bật thị giác bằng cách làm mờ nền hoặc khoanh vùng đồ họa, đóng vai trò như một bộ lọc thông tin giúp điều hướng sự chú ý của trẻ vào đúng các vùng biểu cảm trọng yếu như mắt và miệng, ngăn chặn tình trạng quá tải giác quan. 

**Cuối cùng, trẻ ASD có nhu cầu cao về cấu trúc và sự lặp lại** . Về mặt tâm lý, ngưỡng lo âu của trẻ thường tăng cao trước những thay đổi bất ngờ hoặc môi trường thiếu tính dự báo; ngược lại, trẻ tìm thấy sự an toàn trong các quy trình ổn định. Do đó, trong môi trường kỹ thuật số, tính nhất quán và khả năng dự đoán trở thành yếu tố sống còn của thiết kế. Luồng tương tác của ứng dụng phải được xây dựng theo một kịch bản cố định và các thành phần điều hướng phải được neo tại các vị trí tuyệt đối trên mọi màn hình. Điều này giúp trẻ nhanh chóng xây dựng được mô hình tư duy về cách hệ thống vận hành. Đặc biệt, cơ chế phản hồi từ âm thanh đến màu sắc phải được chuẩn hóa tuyệt đối. Sự ổn định này giúp hình thành phản xạ có điều kiện vững chắc, giảm bớt sự lo âu và tạo tiền đề tâm lý thoải mái để trẻ tham gia vào quá trình luyện tập. 

## **1.2 Lý thuyết về 6 cảm xúc cơ bản và ứng dụng trong công nghệ** 

Nền tảng nội dung giáo dục của hệ thống được xây dựng dựa trên lý thuyết cảm xúc phổ quát của nhà tâm lý học Paul Ekman. Ông xác định 6 cảm xúc cơ bản tồn tại ở mọi nền văn hóa, bao gồm: Hạnh phúc, buồn bã, tức giận, sợ hãi, ngạc nhiên và ghê tởm. Việc lựa chọn bộ cảm xúc này không chỉ dựa trên tính phổ quát về mặt tâm lý học mà còn vì sự tương thích cao với các bài toán kỹ thuật. Mỗi trạng thái cảm xúc trong bộ này đều có thể được định lượng và mô tả cụ thể thông qua sự chuyển động của các nhóm cơ mặt, được mã hóa trong hệ thống mã hóa hành động khuôn mặt (Facial Action Coding System - FACS). 

Sự chuyển dịch từ ngôn ngữ tâm lý sang ngôn ngữ kỹ thuật thông qua các đơn vị hành động (Action Units - AU) là cơ sở cốt lõi để huấn luyện và tinh chỉnh các mô hình AI. Cụ thể, cảm xúc hạnh phúc được đặc trưng bởi sự co cơ gò má lớn (AU12) kết hợp với cơ vòng mắt (AU6) tạo nên nụ cười chân thật. Cảm xúc sợ hãi được nhận diện qua tổ hợp lông mày nhướng cao kéo gần nhau (AU1+2+4) và mắt mở rộng (AU5). Trong khi đó, Tức giận lại biểu hiện qua việc lông mày hạ thấp, nhíu chặt (AU4) và môi mím chặt (AU23). 

Bằng cách phân tích sâu sắc các Action Units này, hệ thống không chỉ nhìn bức ảnh khuôn mặt một cách tổng quát mà thực sự đo lường được mức độ kích hoạt của các nhóm cơ 

_23_ 

cụ thể. Điều này cho phép thuật toán Deep Learning đưa ra các đánh giá định lượng khách quan về khả năng biểu đạt của trẻ, vượt qua những nhận định cảm tính của con người. Bảng phân tích chi tiết các đặc trưng kỹ thuật và ý nghĩa giáo dục của từng loại cảm xúc được trình bày dưới đây nhằm làm rõ cơ sở dữ liệu cho quá trình huấn luyện mô hình. 

Bảng 2.1. Phân tích 6 cảm xúc cơ bản phục vụ xây dựng bài tập và thuật toán AI 

||||
|---|---|---|
|**Cảm xúc**|**Biểu hiện và nghĩa giáo dục**<br>**(Góc độ tâm lý)**|**Đặc trưng kỹ thuật cho AI**<br>**(Facial Action Units - AU)**|
|Hạnh phúc<br>(Happiness)|Biểu hiện: Khóe môi nhếch lên, đuôi<br>mắt nhăn lại (nụ cười Duchenne),<br>gương mặt rạng rỡ.<br>Ý nghĩa: Giúp trẻ hiểu nụ cười là tín<br>hiệu tích cực, thân thiện và chấp thuận,<br>từ đó học cách kết nối xã hội.|AU12: Co cơ gò má lớn, kéo khóe<br>miệng lên cao.<br>AU6: Co cơ vòng mắt, tạo nếp<br>nhăn chân chim ở đuôi mắt (đặc<br>điểm của nụ cười thật).|
|Buồn bã<br>(Sadness)|Biểu hiện: Khóe miệng trễ xuống, mí<br>mắt sụp, gương mặt uể oải, thiếu năng<br>lượng.<br>Ý nghĩa: Phát triển lòng đồng cảm<br>(empathy), nhận biết khi người khác cần<br>an ủi, học phản ứng phù hợp thay vì thờ<br>ơ.|AU1: Lông mày trong nhướng lên.<br>AU15: Khóe miệng trễ xuống.<br>AU4: Lông mày hạ thấp nhẹ.<br>Mí mắt trên sụp xuống.|
|Tức giận<br>(Anger)|Biểu hiện: Lông mày hạ thấp kéo gần<br>nhau, mắt mở căng nhìn chằm chằm,<br>môi mím chặt hoặc hở răng.<br>Ý nghĩa: Giúp trẻ nhận biết sự khó chịu,<br>nguy cơ xung đột để kiềm chế hành vi<br>hoặc tránh xa nguồn gây kích động.|AU4: Lông mày nhíu chặt.<br>AU5: Mắt mở căng.<br>AU7: Mí mắt căng.<br>AU23/24: Môi mím chặt hoặc ép<br>vào nhau.|



_24_ 

|Sợ hãi<br>(Fear)|Biểu hiện: Mắt mở rất to lộ lòng trắng,<br>lông mày nhướng cao kéo gần nhau,<br>miệng hơi mở và kéo ngang.<br>Ý nghĩa: Kỹ năng sinh tồn để nhận diện<br>nguy hiểm và đồng cảm với nỗi sợ của<br>người khác để tìm kiếm sự giúp đỡ.|AU1+2+4: Lông mày nhướng cao<br>và kéo lại gần nhau (đặc trưng<br>riêng biệt).<br>AU5: Mắt mở rộng lộ lòng trắng.<br>AU20: Miệng kéo ngang căng<br>thẳng.|
|---|---|---|
|Ngạc nhiên<br>(Surprise)|Biểu hiện: Mắt mở to, lông mày nhướng<br>cao cong vút, miệng há tròn thư giãn.<br>Ý nghĩa: Nhận biết sự thay đổi đột ngột,<br>kích thích sự tò mò và khả năng thích<br>nghi với tình huống bất ngờ.|AU1+2: Lông mày nhướng cao<br>(không kéo gần như sợ hãi).<br>AU5: Mắt mở to.<br>AU26,27: Hàm rớt xuống, miệng<br>mở tròn thả lỏng (không căng<br>ngang).|
|Ghê tởm<br>(Disgust)|Biểu hiện: Mũi nhăn lại, môi trên bị kéo<br>lên cao.<br>Ý nghĩa: Phân biệt các tác nhân không<br>dễ chịu, tránh nguy cơ tiềm ẩn về vệ<br>sinh, thực phẩm hỏng hoặc môi trường<br>không an toàn.|AU9: Cơ mũi nhăn lại.<br>AU10: Môi trên kéo lên cao.|



## **2. Nền tảng công nghệ thị giác máy tính (CV)** 

Để hiện thực hóa các yêu cầu về tương tác tự nhiên và đánh giá khách quan đã phân tích ở phần trước, đề tài lựa chọn thị giác máy tính (Computer Vision - CV) làm nền tảng công nghệ cốt lõi cho module luyện biểu đạt cảm xúc. Trong bối cảnh hỗ trợ trẻ rối loạn phổ tự kỷ (ASD), CV không chỉ đóng vai trò thu nhận hình ảnh đơn thuần, mà được xem như một “cảm biến hành vi” có khả năng quan sát và diễn giải các tín hiệu phi ngôn ngữ trên khuôn mặt theo thời gian thực. Nhờ đó, hệ thống có thể chuyển camera của thiết bị cá nhân thành một **“tấm gương kỹ thuật số”** , giúp trẻ vừa quan sát biểu cảm của mình vừa nhận phản hồi tức thì để tự điều chỉnh. 

_25_ 

Một điểm quan trọng trong lựa chọn kỹ thuật của dự án là cách thức triển khai nhận diện. Thay vì xây dựng pipeline xử lý ảnh phía server theo hướng gửi ảnh, video lên máy chủ để suy luận, hệ thống triển khai theo hướng suy luận trực tiếp trên trình duyệt (client-side inference). Cụ thể, module Game CV sử dụng thư viện face-api.js để chạy các mô hình học sâu đã huấn luyện sẵn ngay trên thiết bị người dùng. Cách tiếp cận này phù hợp với yêu cầu HCI dành cho trẻ ASD vì: giảm độ trễ phản hồi do mạng, tăng tính ổn định của vòng lặp tương tác, và tăng quyền riêng tư do dữ liệu hình ảnh nhạy cảm không cần lưu trữ hoặc truyền liên tục lên server. 

## **2.1 Tổng quan về bài toán nhận diện cảm xúc khuôn mặt (FER) và ứng dụng thực tiễn** 

Nhận diện cảm xúc khuôn mặt (Facial Expression Recognition - FER) là bài toán trong đó hệ thống máy tính dự đoán trạng thái cảm xúc dựa trên các đặc trưng biểu cảm của khuôn mặt. Về bản chất, FER là một bài toán phân loại trong không gian đặc trưng phức tạp: từ dữ liệu điểm ảnh (pixel) của khung hình đầu vào, hệ thống cần suy ra nhãn cảm xúc và mức độ tin cậy tương ứng. 

Trong đề tài này, FER không được sử dụng như một cơ chế chấm điểm cuối cùng, mà được tích hợp trực tiếp vào trải nghiệm học tập để hình thành vòng lặp phản hồi khép kín: trẻ thực hiện biểu cảm → hệ thống phân tích → giao diện phản hồi gần như tức thì → trẻ điều chỉnh tiếp. Vòng lặp này đặc biệt quan trọng với trẻ ASD do đặc điểm chú ý dễ bị gián đoạn và nhu cầu củng cố hành vi cần diễn ra ngay sau hành động. 

Quy trình FER trong module Game CV được triển khai theo chuỗi xử lý thời gian thực gồm: (1) thu nhận luồng webcam trên trình duyệt, (2) trích khung hình định kỳ thông qua canvas, (3) phát hiện khuôn mặt và đặc trưng hình học (landmarks), (4) ước lượng phân phối xác suất các biểu cảm cơ bản, (5) ánh xạ sang hệ nhãn cảm xúc sử dụng trong nội dung trò chơi (6 cảm xúc cơ bản), và (6) cập nhật giao diện phản hồi theo thời gian thực. Để đảm bảo trải nghiệm không gây áp lực, hệ thống xử lý trạng thái trung tính (neutral) theo hướng phản hồi trung tính thay vì xem như thất bại, từ đó giúp trẻ duy trì tâm lý an toàn và tiếp tục thử lại. 

Ngoài vai trò phản hồi tức thời, kết quả FER còn được sử dụng như một cơ sở định lượng để theo dõi tiến trình. Thay vì dựa hoàn toàn vào nhận xét chủ quan của phụ huynh, giáo viên, hệ thống ghi nhận các chỉ số như: cảm xúc mục tiêu, cảm xúc nhận diện, thời gian thực hiện và điểm tin cậy (thang 0 - 100). Dữ liệu này tạo nền tảng cho việc tổng hợp tiến bộ theo phiên luyện tập và hỗ trợ cá nhân hóa lộ trình học trong các phiên tiếp theo. 

_26_ 

## **2.2 Mạng nơ-ron tích chập (CNN) và ưu thế so với phương pháp truyền thống** 

Trong lịch sử phát triển của nhận diện cảm xúc, các phương pháp truyền thống thường dựa trên đặc trưng thủ công như HOG/LBP kết hợp với các bộ phân loại cổ điển (ví dụ SVM). Ưu điểm của nhóm phương pháp này là tính đơn giản và chi phí tính toán thấp, tuy nhiên chúng dễ suy giảm chất lượng trong môi trường thực tế do nhạy với các biến thiên như góc mặt, ánh sáng, che khuất và nhiễu nền. 

Ngược lại, các mô hình học sâu, đặc biệt là Mạng nơ-ron tích chập (Convolutional Neural Networks - CNN), cho phép hệ thống tự động học đặc trưng theo cấu trúc phân cấp: lớp đầu học cạnh, đường nét cơ bản; các lớp giữa học cấu trúc bộ phận (mắt, mũi, miệng); và các lớp sâu học quan hệ phức tạp để suy ra biểu cảm. Với bối cảnh người dùng là trẻ em (có xu hướng di chuyển nhiều, góc mặt thay đổi liên tục), khả năng tổng quát hóa tốt hơn của CNN là yếu tố then chốt để duy trì phản hồi ổn định và nhất quán, một yêu cầu quan trọng trong thiết kế tương tác cho trẻ ASD. 

Việc dựa trên CNN không nhằm tối đa hóa độ chính xác tuyệt đối như trong các bài toán nghiên cứu thuần túy, mà nhằm đảm bảo hệ thống đủ ổn định để tạo phản hồi tức thời và duy trì niềm tin của người dùng vào cơ chế phản hồi của trò chơi.. 

## **2.3 Thư viện face-api.js và chiến lược sử dụng mô hình tiền huấn luyện** 

Trong phạm vi đồ án và điều kiện nguồn lực dữ liệu hạn chế, hệ thống không xây dựng và huấn luyện mô hình FER từ đầu. Thay vào đó, đề tài lựa chọn chiến lược triển khai thực tiễn: sử dụng mô hình tiền huấn luyện (pretrained) thông qua thư viện face-api.js và thực hiện suy luận (inference) trực tiếp trên trình duyệt. Đây có thể xem là hướng “clone model” theo nghĩa kế thừa mô hình đã được huấn luyện sẵn để đưa vào hệ thống, tập trung tối ưu hóa trải nghiệm và luồng nghiệp vụ thay vì đầu tư vào huấn luyện mô hình mới. 

Hệ thống tải các mô hình cần thiết cho pipeline gồm: mô hình phát hiện khuôn mặt nhẹ (phù hợp thời gian thực), mô hình landmarks và mô hình ước lượng biểu cảm (expression). Về cơ chế tải, hệ thống ưu tiên tải mô hình từ thư mục cục bộ (local) để tăng tính ổn định khi triển khai; trong trường hợp không có mô hình local, hệ thống tự động chuyển sang phương án dự phòng (CDN). Cách thiết kế này đảm bảo tính sẵn sàng và hạn chế gián đoạn trong quá trình sử dụng. 

Lợi ích của hướng triển khai này là cân bằng tốt giữa tính khả thi và yêu cầu HCI: phản hồi nhanh, ít phụ thuộc hạ tầng, dễ triển khai trên máy phổ thông và tăng quyền riêng tư. Trong 

_27_ 

định hướng phát triển sau, nếu thu thập được tập dữ liệu phù hợp cho trẻ em Việt Nam và có quy trình xử lý dữ liệu nhạy cảm đầy đủ, hệ thống có thể mở rộng theo hướng fine-tune hoặc huấn luyện bổ sung để tăng độ phù hợp miền dữ liệu (domain adaptation). Tuy nhiên, ở phiên bản hiện tại, chiến lược pretrained cùng với inference trên client là lựa chọn phù hợp nhất với mục tiêu của đề tài. 

## **3. Các công nghệ phát triển hệ thống** 

Để chuyển hóa các mô hình lý thuyết và thuật toán trí tuệ nhân tạo thành một sản phẩm thực tế có khả năng tiếp cận người dùng cuối, việc lựa chọn ngăn xếp công nghệ đóng vai trò nền tảng. Hệ thống Emo Garden không chỉ cần đáp ứng các yêu cầu khắt khe về hiệu năng xử lý ảnh mà còn phải đảm bảo tính ổn định và mượt mà trong giao diện người dùng, yếu tố sống còn đối với đối tượng trẻ rối loạn phổ tự kỷ vốn nhạy cảm với các gián đoạn kỹ thuật. Dựa trên các tiêu chí này, nhóm nghiên cứu đã xây dựng hệ thống theo kiến trúc phân tách rõ ràng, tối ưu hóa khả năng xử lý tại trình duyệt (Client-side) để giảm độ trễ và tăng cường tính riêng tư. 

## **3.1 Vanilla JavaScript và Vite cho Frontend:** 

Trong phần giao diện, hệ thống sử dụng **Vanilla JavaScript** (JavaScript thuần) kết hợp với công cụ **Vite** để xây dựng môi trường tương tác. Nhóm quyết định không sử dụng các Framework phức tạp (như React hay Angular) xuất phát từ nhu cầu tạo ra một ứng dụng nhẹ, tốc độ tải trang nhanh và dễ dàng tương thích với các thiết bị cấu hình thấp thường thấy tại các gia đình hoặc cơ sở giáo dục. 

Việc sử dụng Vanilla JavaScript giúp giảm thiểu kích thước gói tin và loại bỏ các lớp trừu tượng không cần thiết, giúp ứng dụng hoạt động ổn định và dễ bảo trì. Đặc biệt, công cụ Vite đóng vai trò quan trọng trong việc tối ưu hóa quy trình đóng gói mã nguồn, cung cấp tính năng thay thế module nóng (HMR) giúp quá trình phát triển và cập nhật diễn ra tức thì. 

Bảng dưới đây trình bày các đặc tính kỹ thuật của Frontend và tác động của chúng đối với trải nghiệm của trẻ ASD: 

_28_ 

Bảng 2.2. Các đặc tính kỹ thuật của Frontend (Vanilla JS + Vite) 

|**Tiêu chí**|**Công nghệ áp dụng**|**Tác động đến trải nghiệm trẻ ASD**|
|---|---|---|
|Trải nghiệm<br>tải trang|Vite Build Optimizer: Tối<br>ưu hóa mã nguồn và tài<br>nguyên tĩnh.|Giảm thiểu thời gian chờ đợi ban đầu, ngăn chặn<br>sự mất tập trung do màn hình tải quá lâu.|
|Quản lý<br>trạng thái|LocalStorage<br>và<br>SessionStorage: Lưu trữ<br>cục bộ tiến độ game,<br>thông tin phiên làm việc.|Đảm bảo tính liên tục của bài học. Nếu lỡ tay tải<br>lại trang, trẻ vẫn có thể tiếp tục ngay tại điểm<br>dừng mà không phải chơi lại từ đầu, giảm sự thất<br>vọng.|
|Nhận diện<br>cảm xúc|Face-API.js (Client-side):<br>Thư viện AI chạy trực tiếp<br>trên trình duyệt.|Phản hồi cảm xúc theo thời gian thực (Real-time)<br>không phụ thuộc vào tốc độ mạng, tạo cảm giác<br>"gương phản chiếu" tức thì, giúp trẻ dễ dàng<br>nhận ra mối liên hệ nhân quả.|
|Hỗ trợ âm<br>thanh|Web<br>Speech<br>API<br>+<br>FPT.AI TTS: Tổng hợp<br>tiếng nói tiếng Việt tự<br>nhiên.|Cung cấp hướng dẫn bằng giọng nói rõ ràng cho<br>trẻ chưa thạo đọc, giúp trẻ tiếp cận bài học qua<br>cả kênh thính giác.|



Điểm đột phá trong kiến trúc Frontend của Emo Garden là việc tích hợp **Face-API.js** để xử lý nhận diện khuôn mặt ngay tại trình duyệt (Client-side). Thay vì gửi liên tục hình ảnh về máy chủ (gây độ trễ và tốn băng thông), việc xử lý tại chỗ giúp hệ thống phản hồi ngay lập tức với biểu cảm của trẻ, đồng thời bảo vệ tuyệt đối quyền riêng tư về hình ảnh. 

## **3.2 FastAPI và Python cho Backend: Kiến trúc hướng dịch vụ và tích hợp Generative AI** 

Trong kiến trúc hệ thống, Backend đóng vai trò là trung tâm quản lý dữ liệu, điều phối logic nghiệp vụ phức tạp và tích hợp các dịch vụ AI tạo sinh. Nhóm nghiên cứu lựa chọn **Python** kết hợp với **FastAPI** để tận dụng hiệu năng cao của chuẩn ASGI và hệ sinh thái thư viện phong phú của Python. 

_29_ 

Hệ thống Backend được thiết kế theo mô hình **Clean Architecture** , phân tách rõ ràng các tầng: Controllers (xử lý yêu cầu), Services (logic nghiệp vụ), Repositories (truy cập dữ liệu) và Models. Cách tổ chức này giúp hệ thống dễ dàng mở rộng và bảo trì. 

Các thành phần công nghệ chính trong Backend bao gồm: 

Bảng 2.3. Các thành phần công nghệ Backend 

||Bảng 2.3. Các thành phần công nghệ Backend|
|---|---|
|**Công nghệ**|**Vai trò trong hệ thống**|
|**FastAPI**|Framework hiệu năng cao, hỗ trợ xử lý bất đồng bộ (async/await), tự<br>động sinh tài liệu API (Swagger UI).|
|**SQL Server +**<br>**SQLAlchemy**|Hệ quản trị cơ sở dữ liệu mạnh mẽ kết hợp với thư viện ORM để quản lý<br>dữ liệu người dùng và lịch sử chơi một cách an toàn, nhất quán.|
|**Google Gemini**<br>**AI**|Tích hợp làm trợ lý ảo (Chatbot), cung cấp hướng dẫn chơi game và giải<br>đáp thắc mắc bằng ngôn ngữ tự nhiên tiếng Việt.|
|**ReportLab +**<br>**Pillow**|Thư viện xử lý đồ họa và văn bản để tự động tạo báo cáo tiến độ định<br>dạng PDF gửi cho phụ huynh.|
|**SMTP (Gmail**<br>**Service)**|Dịch vụ gửi email tự động cho báo cáo kết quả và mã xác thực (OTP).|



Khác với các hệ thống xử lý ảnh truyền thống, Backend của Emo Garden không trực tiếp xử lý hình ảnh. Frontend chỉ gửi về kết quả suy luận (loại cảm xúc, độ chính xác) để Backend lưu trữ, tính điểm và phân tích xu hướng. 

Cơ chế bất đồng bộ (async/await) của FastAPI đặc biệt hữu ích khi hệ thống phải xử lý nhiều tác vụ I/O cùng lúc như: gọi API sang Google Gemini, truy vấn cơ sở dữ liệu SQL Server hay gửi email báo cáo. Điều này đảm bảo độ trễ phản hồi của API luôn duy trì ở mức thấp (dưới 200 ms), giúp trải nghiệm từ phía người dùng luôn mượt mà và không bị gián đoạn. 

_30_ 

## **3.3 Cơ chế truy cập camera và xử lý khung hình thời gian thực bằng getUserMedia** 

Trong module luyện biểu đạt cảm xúc qua camera (Game CV), hệ thống cần tạo ra một trải nghiệm tương tác tự nhiên, nơi khuôn mặt của trẻ trở thành kênh điều khiển chính. Để thực hiện điều đó, hệ thống sử dụng chuẩn truy cập camera của Web hiện đại là **getUserMedia** (thuộc navigator.mediaDevices). Cơ chế này cho phép trình duyệt xin quyền camera và hiển thị trực tiếp hình ảnh lên giao diện mà không yêu cầu cài đặt phần mềm bổ sung, phù hợp với mục tiêu triển khai dễ dàng trên thiết bị phổ thông tại gia đình hoặc trường học. 

Sau khi camera được bật, hệ thống vận hành theo mô hình lấy mẫu khung hình theo chu kỳ ngắn (thay vì xử lý toàn bộ luồng video như một luồng phát trực tuyến). Mỗi thời điểm, hệ thống trích một khung hình từ luồng video để thực hiện phân tích biểu cảm. Cách tiếp cận theo hướng “lấy mẫu” giúp kiểm soát khối lượng tính toán, đảm bảo ổn định trên nhiều cấu hình máy khác nhau, đồng thời vẫn duy trì được cảm giác phản hồi nhanh đối với người chơi. 

Điểm quan trọng của dự án là: khung hình camera không được truyền liên tục lên máy chủ để suy luận. Thay vào đó, nhận diện biểu cảm được thực hiện ngay trên phía trình duyệt bằng thư viện thị giác máy tính ( **face-api.js** ). Điều này giúp giảm đáng kể độ trễ do mạng, duy trì vòng lặp phản hồi gần như tức thời (trẻ thay đổi nét mặt → hệ thống cập nhật trạng thái), đồng thời hạn chế rủi ro liên quan đến dữ liệu nhạy cảm vì hình ảnh khuôn mặt không cần gửi lên server trong quá trình nhận diện. 

Trong kiến trúc tổng thể, backend đóng vai trò cung cấp dữ liệu bài luyện (tình huống, yêu cầu), quản lý phiên chơi và lưu kết quả theo dạng dữ liệu định lượng (ví dụ: cảm xúc mục tiêu, cảm xúc nhận diện, thời gian thực hiện, mức độ tin cậy). Cách phân tách này tạo ra một quy trình vừa ổn định vừa dễ triển khai: phần tương tác thời gian thực diễn ra tại client, còn phần nghiệp vụ và lưu trữ được đảm nhiệm bởi server. 

## **3.4 Google Generative AI (Gemini) và kỹ thuật Prompt Engineering theo Rulebase** 

Để hỗ trợ người dùng (đặc biệt là phụ huynh, giáo viên và trẻ ở mức câu hỏi đơn giản) trong quá trình sử dụng hệ thống, dự án tích hợp một chatbot hướng dẫn dựa trên **Google Generative AI** (mô hình Gemini). Khác với chatbot truyền thống dựa trên so khớp từ khóa, LLM cho phép hệ thống hiểu câu hỏi tự nhiên và phản hồi linh hoạt theo ngữ cảnh, giúp giải thích luật chơi, hướng dẫn thao tác và gợi ý cách thực hiện bài luyện một cách thân thiện. 

_31_ 

Tuy nhiên, do bối cảnh sử dụng thuộc nhóm giáo dục đặc biệt, chatbot cần được kiểm soát chặt để đảm bảo trả lời đúng mục tiêu và tránh lan man. Vì vậy, dự án áp dụng kỹ thuật Prompt Engineering theo hướng **System Prompting / Context Injection** kết hợp **Rule-base** . Cụ thể, hệ thống xây dựng một kho mô tả, hướng dẫn theo từng trò chơi (ví dụ: game trắc nghiệm, game lắp mặt, game camera…), đóng vai trò như “tri thức nền” để chatbot dựa vào khi trả lời. Khi người dùng đặt câu hỏi, backend sẽ gắn ngữ cảnh đang chơi (như game_id, level nếu có) và ghép nội dung hướng dẫn tương ứng vào một “system instruction” nhằm định hướng Gemini: trả lời ngắn gọn, tiếng Việt, đúng trọng tâm hướng dẫn, phù hợp độ tuổi. 

Ngoài việc kiểm soát nội dung, hệ thống còn chú trọng trải nghiệm khi dịch vụ AI gặp vấn đề. Trong trường hợp thiếu cấu hình khóa API hoặc gặp lỗi khi gọi mô hình, backend không trả về thông báo lỗi kỹ thuật gây khó hiểu cho người dùng cuối. Thay vào đó, hệ thống sử dụng cơ chế phản hồi dự phòng (fallback) dựa trên Rule-base: chatbot vẫn có thể nhắc lại luật chơi cơ bản hoặc hướng dẫn thao tác tối thiểu để người dùng tiếp tục sử dụng hệ thống mà không bị gián đoạn. Thiết kế này phù hợp nguyên tắc HCI về khoan dung lỗi và duy trì mạch tương tác, đặc biệt quan trọng với nhóm người dùng dễ bị ảnh hưởng bởi trải nghiệm tiêu cực. 

Tóm lại, chatbot trong dự án được triển khai như một trợ lý hướng dẫn có kiểm soát: Gemini đảm nhiệm khả năng diễn đạt tự nhiên, Rule-base đảm nhiệm tính đúng đắn theo hệ thống, và Prompt Engineering đảm nhiệm việc ràng buộc phạm vi - phong cách trả lời, nhằm tạo ra trải nghiệm hỗ trợ thân thiện, rõ ràng và an toàn. 

## **4. Lý thuyết Gamification và HCI trong can thiệp hành vi** 

Trong kiến trúc tổng thể của hệ thống, trò chơi hóa ( **Gamification** ) không đơn thuần là lớp vỏ bọc giải trí nhằm thu hút sự chú ý nhất thời, mà được thiết kế như một cơ chế tương tác cốt lõi để giải quyết bài toán khó khăn nhất trong trị liệu tự kỷ: duy trì động lực và hình thành phản xạ. Dưới góc độ tương tác Người - Máy (HCI), việc áp dụng Gamification trong dự án này là sự chuyển hóa lý thuyết củng cố tích cực của tâm lý học hành vi thành các tín hiệu phản hồi kỹ thuật số, tạo ra một môi trường giao tiếp phi ngôn ngữ mà trẻ có thể hiểu và kiểm soát được. 

Cơ chế vận hành trung tâm của hệ thống là **vòng lặp phản hồi sinh học** . Khác với các tương tác thông thường nơi người dùng nhận phản hồi sau khi hoàn tất một chuỗi thao tác (như điền form hay giải toán), đối với trẻ ASD, phản hồi cần phải diễn ra đồng thời với hành vi. Khi trẻ thực hiện một thay đổi trên cơ mặt, hệ thống AI đóng vai trò như một bộ cảm biến sinh học, ghi nhận sự thay đổi đó và trả về tín hiệu thị giác, thính giác với độ trễ gần như bằng không. Sự đồng bộ tức thì này là yếu tố HCI sống còn: nó giúp não bộ trẻ thiết lập mối liên kết nhân 

_32_ 

quả vững chắc giữa nỗ lực điều khiển cơ mặt và kết quả tích cực trên màn hình. Nếu độ trễ vượt quá ngưỡng nhận thức (khoảng 300 ms), mối liên kết này sẽ bị đứt gãy, và trẻ sẽ không hiểu được tín hiệu thưởng đó là dành cho hành động nào. 

Bên cạnh tốc độ, tính chất của phản hồi cũng tuân thủ nghiêm ngặt nguyên tắc thiết kế khoan dung trong HCI. Trẻ tự kỷ thường có ngưỡng chịu đựng thấp đối với sự thất bại và dễ rơi vào trạng thái lo âu khi bị phán xét. Do đó, hệ thống được thiết kế như một hộp cát an toàn, nơi khái niệm “Game Over” hay các tín hiệu báo lỗi tiêu cực (âm thanh chói, màu đỏ cảnh báo) bị loại bỏ hoàn toàn. Thay vào đó, khi trẻ thực hiện chưa đúng, hệ thống chỉ đơn giản là không kích hoạt hiệu ứng thưởng hoặc đưa ra gợi ý dẫn dắt nhẹ nhàng. Cách tiếp cận này loại bỏ áp lực tâm lý, khuyến khích trẻ thực hiện chiến lược thử và sai một cách tự nhiên. Môi trường tương tác không trừng phạt giúp chuyển hóa quá trình trị liệu từ một nhiệm vụ bắt buộc thành một hành trình khám phá an toàn, nơi trẻ làm chủ tốc độ học tập của chính mình. 

Cuối cùng, hệ thống đánh giá của trò chơi được xây dựng để ghi nhận sự tiến bộ vi mô. Thay vì sử dụng cơ chế nhị phân (đúng, sai tuyệt đối) vốn cứng nhắc, hệ thống sử dụng thang đo mức độ tương đồng liên tục. Dưới góc độ thiết kế trải nghiệm, điều này có nghĩa là mọi nỗ lực của trẻ, dù chỉ là một sự thay đổi nhỏ ở khóe môi hay ánh mắt, đều được hệ thống ghi nhận và phản hồi. Việc chia nhỏ mục tiêu và cung cấp các phần thưởng tăng dần (từ hiệu ứng nhỏ đến hiệu ứng lớn) giúp duy trì trạng thái dòng chảy, nơi thách thức vừa đủ với kỹ năng, giữ cho trẻ không bị chán nản vì quá dễ hoặc bỏ cuộc vì quá khó. Tổng hòa lại, việc áp dụng triệt để các nguyên lý HCI này biến hệ thống từ một công cụ kiểm tra khô khan thành một người bạn đồng hành thấu cảm, kiên nhẫn và luôn khích lệ. 

_33_ 

## **CHƯƠNG 3: THU THẬP, PHÂN TÍCH VÀ ĐẶC TẢ YÊU CẦU** 

Sau khi đã xác lập các cơ sở lý luận về đặc điểm tâm lý của trẻ ASD và tiềm năng công nghệ tại chương 2, chương này sẽ đi sâu vào việc chuyển hóa các nguyên lý HCI thành các đặc tả kỹ thuật cụ thể. Mục tiêu cốt lõi của chương này là xác định rõ chân dung người dùng, bối cảnh sử dụng và các yêu cầu hệ thống nhằm tạo ra một sản phẩm công nghệ không chỉ vận hành chính xác mà còn phải đảm bảo tính khả dụng và phù hợp với mô hình tư duy đặc biệt của trẻ. 

## **1. Xác định bài toán và đối tượng sử dụng** 

Sau khi hệ thống lý luận về đặc điểm tâm lý của trẻ trong phổ tự kỷ và khả năng ứng dụng công nghệ được làm rõ ở chương trước, bước tiếp theo là chuyển đổi những nguyên lý đó thành một bài toán kỹ thuật và nhân văn cụ thể. Ở tầm cao nhất, bài toán không chỉ là đạt được độ chính xác nhận diện cảm xúc trên ảnh tĩnh; mà là kiến tạo một môi trường tương tác có thể giúp trẻ luyện tập, thử nghiệm và dần dần nội hóa kỹ năng nhận diện và biểu đạt cảm xúc trong đời sống thực. Điều này đòi hỏi phải đặt người dùng ở trung tâm: hiểu họ như một hệ thống sinh học, có nhạy cảm giác quan, thói quen nhận thức và giới hạn chú ý, chứ không chỉ là một đầu vào cho mô hình AI. Trên cơ sở đó, hệ thống được định vị phục vụ hai nhóm người dùng với vai trò khác nhau nhưng bổ trợ lẫn nhau: trẻ em là người học trực tiếp, phụ huynh và giáo viên là người giám sát và ra quyết định. Sự phân chia này sẽ dẫn tới hai luồng trải nghiệm riêng biệt, một luồng dành cho sự an toàn cảm xúc và tối giản thông tin, một luồng dành cho phân tích dữ liệu và ra quyết định, nhưng cả hai phải cùng vận hành trong một hệ sinh thái đồng nhất. 

## **1.1 Chân dung người dùng chính:** 

Đối tượng chính của đề tài này là trẻ rối loạn tự kỷ. Trẻ thuộc phân khúc mục tiêu của dự án là các em từ 4 đến 12 tuổi, chủ yếu nằm trong nhóm chức năng cao hoặc có chậm phát triển nhẹ. Về năng lực hành vi, nhiều em sở hữu kỹ năng vận động tinh đủ để thao tác máy tính cơ bản, điều này cho phép thiết kế các nhiệm vụ không buộc phải loại khỏi điều khiển thủ công. Tuy nhiên, lõi vấn đề nằm ở cách các em xử lý thông tin cảm xúc: trẻ thường gặp khó khăn trong việc đọc tín hiệu phi ngôn ngữ, phân biệt sắc thái biểu cảm và tự điều tiết biểu cảm cơ mặt. Những khó khăn này không thuần túy là một khiếm khuyết nhận diện, mà là một rối loạn trong vòng khép nối giữa cảm nhận nội thân, chú ý thị giác và phản hồi hành vi. Do vậy, thiết kế hệ thống cần chuyển trọng tâm từ đo lường đúng, sai sang hỗ trợ quá trình học: làm sao để trẻ có 

_34_ 

thể quan sát mẫu, thử nghiệm, nhận phản hồi tức thời và lặp lại trong môi trường không phán xét. 

Về yêu cầu nhận thức, trẻ trong phổ này có đặc điểm chung là ngưỡng nhạy cảm giác quan thấp và xu hướng cần tính dự đoán cao. Những yếu tố kích thích thị giác hoặc âm thanh mạnh có thể nhanh chóng gây quá tải và dẫn đến phản ứng né tránh. Vì vậy, giao diện cần đưa ra cấu trúc không gian cố định, hạn chế chuyển động không cần thiết và đồng nhất các tín hiệu phản hồi. Về mặt thời gian, phản hồi phải gần như tức thì, cả lý do sinh lý và lý do học tập đều chỉ ra rằng sự trì hoãn giữa hành động của trẻ và phần thưởng phá vỡ mối liên hệ nhân quả, làm giảm hiệu lực củng cố hành vi. Về cảm xúc, hệ thống phải có tính khoan dung: cho phép thử, sai mà không hình phạt, cung cấp gợi ý mềm dẻo và khuyến khích nỗ lực nhỏ thay vì trừng phạt sai sót. 

Từ góc độ HCI, những đặc điểm trên chuyển thành các yêu cầu cụ thể: ổn định không gian giao diện để trẻ dễ xây dựng mô hình tinh thần; ưu tiên các kênh trực quan ngắn gọn thay vì văn bản dài; thiết kế vùng thao tác lớn, rõ ràng để giảm tải về vận động tinh; phản hồi đa giác quan nhưng điều chỉnh cường độ để tránh gây quá tải. Về thuật toán, mô hình phân loại cảm xúc phải cung cấp không chỉ nhãn mà còn độ tin cậy và độ ổn định biểu cảm theo thời gian, để giao diện có thể đưa ra các phản hồi phù hợp với mức độ chắc chắn của kết luận AI. 

## **1.2 Chân dung người dùng thứ cấp:** 

Phụ huynh và giáo viên là người dùng thứ cấp, không tham gia tương tác trực tiếp với cơ chế nhận diện cảm xúc mỗi phút một giây, nhưng họ là nhân tố quyết định cho việc áp dụng, điều chỉnh và duy trì chương trình can thiệp. Quan điểm của nhóm này thiên về kết quả, hiệu quả thời gian và khả năng đưa ra quyết định dựa trên bằng chứng. Trong thực tế, họ thường thiếu các thước đo khách quan và bị buộc vào các đánh giá cảm tính; điều này dẫn đến những quyết định không nhất quán hoặc trì hoãn can thiệp cần thiết. Như vậy, nhiệm vụ của giao diện dành cho nhóm này không phải là trình diễn công nghệ, mà là chuyển các dữ liệu phức tạp thành các thông tin có thể hành động: xu hướng tiến bộ, vùng yếu kém theo cảm xúc, thời điểm cần can thiệp bổ sung. 

Thiết kế cho phụ huynh và giáo viên cần thu hẹp khoảng cách giữa số liệu và thực hành. Báo cáo nên bắt đầu bằng tóm tắt điều hành ngắn gọn, nêu những điểm cần chú ý trong tuần, tháng; tiếp đó, cho phép khoan sâu vào các biểu đồ xu hướng, ma trận nhầm lẫn cảm xúc hay thống kê thời gian phản hồi. Đặc biệt hữu ích là các đề xuất can thiệp mang tính cụ thể, ví dụ bài tập ngắn 3 - 5 phút để luyện ngạc nhiên, vì người lớn thường không có thời gian tự mình 

_35_ 

xây dựng giáo án. Về trải nghiệm người dùng, giao diện của họ phải ưu tiên tính rõ ràng, giảm bớt thuật ngữ chuyên môn không cần thiết và cung cấp các cảnh báo mềm khi hệ thống phát hiện xu hướng cần chú ý. 

## **1.3 Phạm vi nghiên cứu và môi trường vận hành** 

Để đảm bảo tính thực tiễn và khả thi trong khuôn khổ đồ án, phạm vi nghiên cứu được giới hạn cả về nội dung giáo dục lẫn hạ tầng triển khai. Về nội dung, dự án tập trung vào sáu cảm xúc cơ bản theo Paul Ekman, vui, buồn, tức giận, sợ hãi, ngạc nhiên và ghê tởm, vì chúng vừa có nền tảng khoa học mạnh, vừa tương đối dễ diễn giải qua dấu hiệu khuôn mặt; những cảm xúc xã hội phức tạp hơn tạm thời được loại trừ để tránh làm loãng mục tiêu can thiệp ban đầu. Về công nghệ, hệ thống được định hướng là một ứng dụng web chạy trên trình duyệt nhằm tối đa hóa khả năng tiếp cận, không yêu cầu phần cứng chuyên dụng hay cài đặt phức tạp, đồng thời phải xử lý được luồng dữ liệu hình ảnh dưới những điều kiện thực tế tại gia, nơi ánh sáng, vị trí camera và độ ổn định thiết bị rất khác so với phòng thí nghiệm. 

Những giới hạn này có hệ quả thiết kế rõ ràng. Vì hoạt động trên thiết bị phổ thông, mô hình AI cần được tinh chỉnh để cân bằng giữa độ chính xác và chi phí tính toán: ưu tiên kiến trúc nhẹ, kỹ thuật lượng tử hóa và tái tạo đặc trưng để giảm chi phí suy luận. Vì môi trường ánh sáng biến thiên, hệ thống cần kèm các bước tiền xử lý bù sáng và kiểm soát chất lượng khung hình ngay tại trình duyệt để tránh đưa dữ liệu nhiễu lên máy chủ. Cuối cùng, vì mục tiêu thực thi là hỗ trợ can thiệp lâu dài, cần có cơ chế lưu trữ và phân tích chuỗi thời gian để cung cấp các chỉ số tiến bộ có ý nghĩa, không chỉ báo cáo theo từng phiên đơn lẻ. 

## **1.4 Kết luận** 

Tóm lại, chương này khởi đầu bằng việc coi bài toán không phải là một thách thức công nghệ thuần túy mà là một bài toán thiết kế lấy con người làm trung tâm: làm thế nào để công nghệ vừa nhạy, vừa khoan dung, vừa khả thi về mặt triển khai trên thiết bị phổ thông, nhằm hỗ trợ quá trình học cảm xúc cho trẻ ASD và cung cấp công cụ ra quyết định hữu ích cho người lớn. Các phân tích và tiền đề nêu trên sẽ được chuyển tiếp trực tiếp thành các yêu cầu chức năng và phi chức năng trong phần tiếp theo của chương này. Nếu bạn đồng ý với cách tiếp cận và mức độ chi tiết này, tôi sẽ triển khai tiếp phần 2 sau theo cùng phương pháp phân tích sâu từng đoạn. 

## **2. Thu thập và phân tích yêu cầu** 

Dựa trên quá trình khảo sát và phân tích đặc điểm tâm lý của nhóm đối tượng người dùng chính (trẻ rối loạn phổ tự kỷ) và nhóm người dùng thứ cấp (phụ huynh, giáo viên), nhóm nghiên cứu 

_36_ 

đã xác định các yêu cầu cụ thể để định hướng phát triển sản phẩm. Các yêu cầu này được chia thành hai nhóm chính: yêu cầu chức năng và yêu cầu phi chức năng, nhằm đảm bảo hệ thống không chỉ vận hành đúng nghiệp vụ mà còn đáp ứng các tiêu chuẩn khắt khe về trải nghiệm người dùng đặc thù. 

## **2.1 Yêu cầu chức năng** 

Hệ thống được thiết kế với 8 nhóm chức năng cốt lõi, tạo nên một quy trình can thiệp khép kín từ khâu tiếp nhận, luyện tập đến đánh giá và báo cáo. Bảng dưới đây mô tả chi tiết sự ánh xạ từ nhu cầu thực tế của người dùng sang các chức năng kỹ thuật của hệ thống: 

Bảng 3.1. Ánh xạ yêu cầu người dùng và chức năng hệ thống 

|**STT**|**Tên**<br>**chức**<br>**năng**|**Yêu cầu từ người**<br>**dùng (User needs)**|**Chức năng hệ thống cần đáp ứng**<br>**(System features)**|
|---|---|---|---|
|1|Đăng ký<br>và đăng<br>nhập|Người dùng như phụ<br>huynh,<br>giáo<br>viên<br>muốn đảm bảo tính<br>bảo mật cho thông tin<br>của trẻ và yêu cầu<br>một lộ trình học tập<br>được cá nhân hóa,<br>nơi dữ liệu tiến bộ<br>được lưu trữ riêng<br>biệt và không bị trộn<br>lẫn.|Hệ thống cung cấp quy trình đăng ký tài<br>khoản chặt chẽ. Người dùng có thể đăng ký<br>tài khoản mới bằng email, số điện thoại cá<br>nhân của phụ huynh, giáo viên, cung cấp các<br>thông tin cơ bản như họ tên trẻ, giới tính,<br>ngày sinh, số điện thoại phụ huynh, giáo<br>viên, tên đăng nhập cũng như mật khẩu cho<br>tài khoản. Sau khi đăng ký thành công, người<br>dùng đăng nhập để truy cập vào web luyện<br>tập riêng biệt, nơi mọi dữ liệu tiến bộ của trẻ<br>được lưu trữ an toàn và đồng bộ, cá nhân hóa<br>đối với từng người chơi.|



_37_ 

|||||
|---|---|---|---|
|**STT**|**Tên**<br>**chức**<br>**năng**|**Yêu cầu từ người**<br>**dùng (User needs)**|**Chức năng hệ thống cần đáp ứng**<br>**(System features)**|
|2|Học và<br>ôn tập<br>kiến thức|Trẻ cần xây dựng nền<br>tảng nhận thức thụ<br>cảm<br>thông<br>qua<br>phương<br>pháp<br>đa<br>phương thức (hình<br>ảnh, âm thanh, văn<br>bản) để dễ hình dung<br>các khái niệm trừu<br>tượng. Môi trường<br>học cần phi áp lực để<br>trẻ tự do quan sát.|Hệ thống áp dụng phương pháp đa phương<br>thức dưới dạng các thẻ học thông minh, kết<br>hợp đồng bộ giữa hình ảnh trực quan, nhãn<br>dán văn bản và âm thanh định danh nhằm<br>giúp trẻ thiết lập liên kết bền vững giữa khái<br>niệm ngôn ngữ và tín hiệu thị giác. Nội dung<br>bài học được tổ chức theo lộ trình từ tĩnh đến<br>động: bắt đầu bằng việc quan sát ảnh tĩnh để<br>phân tích các đặc trưng giải phẫu học của<br>khuôn mặt, sau đó chuyển sang các video<br>mẫu để hiểu quá trình diễn tiến cảm xúc<br>trong ngữ cảnh xã hội. Loại bỏ cơ chế chấm<br>điểm ở chế độ này để khuyến khích trẻ củng<br>cố kiến thức nền tảng.|
|3|Luyện<br>tập biểu<br>đạt<br>cảm xúc<br>(Game<br>CV)|Trẻ cần nhìn thấy<br>chính mình (như soi<br>gương) để tự điều<br>chỉnh hành vi và cần<br>nhận được phản hồi<br>tức thì khi biểu đạt<br>đúng để hình thành<br>phản xạ (cơ chế phản<br>hồi sinh học).|Ứng dụng công nghệ thị giác máy tính truy<br>cập webcam, biến màn hình thành gương kỹ<br>thuật số giúp trẻ thấy được cảm xúc mà mình<br>đang thể hiện. Hệ thống tự động phân tích<br>đặc trưng cơ mặt (mở miệng, nhướng mày)<br>và đưa ra phản hồi thị giác, âm thanh tức thì<br>kèm tỉ lệ chính xác khi trẻ thể hiện cảm xúc<br>theo yêu cầu.|



_38_ 

|||||
|---|---|---|---|
|**STT**|**Tên**<br>**chức**<br>**năng**|**Yêu cầu từ người**<br>**dùng (User needs)**|**Chức năng hệ thống cần đáp ứng**<br>**(System features)**|
|4|Luyện<br>tập nhận<br>diện, học<br>và ôn tập<br>cảm xúc<br>(Game<br>Click)|Trẻ cần củng cố, ôn<br>tập kiến thức nền<br>tảng về nhận diện<br>cảm xúc trong các<br>câu hỏi trắc nghiệm<br>về cảm xúc, tình<br>huống xã hội và cần<br>sự hỗ trợ (gợi ý) khi<br>gặp khó khăn để<br>tránh tâm lý chán<br>nản.|Cung cấp các bài tập trắc nghiệm tương tác<br>(quan sát hình ảnh, video và chọn đáp án).<br>Tích hợp cơ chế gợi ý cho trẻ khi chơi: hệ<br>thống có thể đưa ra gợi ý khi trẻ gặp khó<br>khăn, giúp trẻ hoàn thành nhiệm vụ và ôn<br>luyện kỹ năng nhận diện cụ thể.|
|5|Báo cáo<br>tiến độ|Phụ huynh, giáo viên<br>cần các chỉ số định<br>lượng chi tiết để theo<br>dõi sát sao sự phát<br>triển của trẻ, từ đó có<br>cơ sở để điều chỉnh<br>phương pháp hỗ trợ<br>kịp thời.|Hệ thống tự động ghi nhận và tổng hợp dữ<br>liệu thành báo cáo trực quan. Cung cấp các<br>chỉ số: Tần suất luyện tập, tỉ lệ chính xác<br>theo từng loại cảm xúc và biểu đồ xu hướng<br>tiến bộ theo tuần, tháng.|
|6|Tự điều<br>chỉnh<br>cảm xúc<br>cần học|Quá trình học cần<br>được tối ưu hóa theo<br>năng lực cá nhân, trẻ<br>cần tập trung ôn tập<br>nhiều hơn vào các<br>cảm xúc mà mình<br>còn yếu hoặc hay sai<br>thay vì học dàn trải.|Hệ thống tự động cập nhật tỷ lệ sai sót của<br>các cảm xúc sau mỗi ván chơi. Dựa trên dữ<br>liệu này, hệ thống thay đổi bộ câu hỏi ở các<br>level tiếp theo, tăng cường tần suất xuất hiện<br>của các cảm xúc trẻ chưa tốt để cá nhân hóa<br>lộ trình.|



_39_ 

|||||
|---|---|---|---|
|**STT**|**Tên**<br>**chức**<br>**năng**|**Yêu cầu từ người**<br>**dùng (User needs)**|**Chức năng hệ thống cần đáp ứng**<br>**(System features)**|
|7|Học<br>lại<br>trực tiếp<br>khi đang<br>chơi|Trẻ cần được sửa lỗi<br>và ôn tập lại kiến<br>thức ngay tại thời<br>điểm mắc lỗi sai<br>nhiều đối với 1 cảm<br>xúc để đảm bảo tính<br>liên tục của tư duy,<br>không cần đợi đến<br>cuối buổi học.|Khi phát hiện trẻ sai một cảm xúc quá số lần<br>quy định trong lúc chơi, hệ thống tự động<br>hiển thị thẻ học của cảm xúc đó để trẻ ôn tập<br>lại ngay lập tức. Sau khi ôn xong, trẻ tiếp tục<br>trò chơi.|
|8|Chatbot<br>hỗ trợ và<br>hướng<br>dẫn|Phụ huynh, giáo viên<br>(đặc biệt là người<br>mới) cần được hướng<br>dẫn thao tác hoặc giải<br>thích chỉ số báo cáo<br>nhanh chóng bằng<br>ngôn ngữ tự nhiên mà<br>không cần tra cứu tài<br>liệu thủ công.|Tích hợp trợ lý ảo AI (Google Gemini API +<br>Rule-base). Chatbot hỗ trợ giải đáp thắc mắc<br>liên quan đến hệ thống, hướng dẫn sử dụng<br>và tự động từ chối các nội dung ngoài lề để<br>duy trì môi trường giáo dục an toàn, chuyên<br>nghiệp.|



## **2.2 Yêu cầu phi chức năng** 

Bên cạnh các chức năng nghiệp vụ, hệ thống phải tuân thủ nghiêm ngặt các tiêu chuẩn kỹ thuật để đảm bảo tính khả dụng và hiệu quả trị liệu. 

## **Về hiệu năng:** 

1. Ứng dụng phải được khởi động lên trong thời gian nhỏ hơn 3s. 

2. Thời gian di chuyển giữa các màn hình, tác vụ (trang chủ, chơi game, chuyển câu hỏi, …) nhỏ hơn 200ms. 

_40_ 

3. Đối với chatbot yêu cầu thời gian phản hồi trung bình dưới 5s. 

4. Hệ thống phải đảm bảo khả năng xử lý thời gian thực với độ trễ thấp. Cụ thể, thời gian từ lúc trẻ thực hiện biểu cảm đến khi nhận được phản hồi thị giác phải dưới 300 ms để duy trì mối liên kết nhân quả trong nhận thức của trẻ. 

5. Mô hình AI cần được tối ưu hóa để vận hành ổn định trên các thiết bị máy tính phổ thông mà không yêu cầu phần cứng chuyên dụng (GPU rời). 

## **Về giao diện và trải nghiệm người dùng (UI/UX):** 

1. Giao diện người dùng phải thân thiện với hầu hết người Việt Nam. Các tác vụ hiển thị trên dashboard để người dùng dễ nhìn thấy. Cụ thể, dựa trên khảo sát tối thiểu 20 người trên thang điểm 5.0 về độ thân thiện giao diện, ứng dụng phải đạt tối thiểu 4.0 điểm. 

2. Hệ thống phải có cơ chế phản hồi khoan dung, không sử dụng các tín hiệu báo lỗi tiêu cực mạnh gây lo âu cho trẻ. Màu sắc và âm thanh phải được lựa chọn kỹ lưỡng để không gây quá tải giác quan. 

## **Về tính sẵn sàng và khả dụng:** 

1. Ứng dụng phải hoạt động ổn định trên các trình duyệt web phổ biến (Chrome, Edge, Firefox, Cốc Cốc, …) mà không yêu cầu cài đặt phức tạp. 

2. Hệ thống cần có khả năng xử lý lỗi linh hoạt (ví dụ: khi mất kết nối mạng hoặc không nhận diện được khuôn mặt) bằng các thông báo thân thiện. 

## **Về bảo mật và quyền riêng tư:** 

1. Do đối tượng sử dụng là trẻ em và dữ liệu thu thập là hình ảnh khuôn mặt nhạy cảm, hệ thống phải tuân thủ các quy định nghiêm ngặt về bảo mật. Dữ liệu hình ảnh chỉ được xử lý trên bộ nhớ tạm (RAM) để trích xuất đặc trưng và không được lưu trữ vĩnh viễn dưới dạng ảnh gốc. 

2. Các thông tin cá nhân và báo cáo tiến độ phải được mã hóa và bảo vệ bằng cơ chế xác thực an toàn. 

## **Về khả năng bảo trì và mở rộng:** 

1. Mã nguồn hệ thống cần được tổ chức theo kiến trúc module hóa (Modular Architecture), tách biệt rõ ràng giữa Frontend, Backend và AI Model để thuận tiện cho việc nâng cấp và bảo trì. 

_41_ 

2. Hệ thống cần có khả năng mở rộng để tích hợp thêm các module bài tập mới hoặc hỗ trợ đa ngôn ngữ trong tương lai. 

## **3. Phân tích và đặc tả ca sử dụng** 

## **3.1 Xác định các tác nhân và ca sử dụng chính của hệ thống** 

Hệ thống EmoGarden được xây dựng theo mô hình phân quyền rõ ràng, phục vụ đồng thời nhiều nhóm người dùng với vai trò, mục tiêu và cách thức tương tác khác nhau. Việc xác định chính xác các tác nhân là cơ sở để thiết kế ca sử dụng phù hợp, tránh chồng chéo chức năng và đảm bảo mỗi nhóm người dùng chỉ tiếp cận đúng phần hệ thống cần thiết. 

Về mặt kiến trúc nghiệp vụ, hệ thống được chia thành hai phân hệ chính: Trang quản trị (Admin Site) và trang người dùng (User Site). Mỗi phân hệ phục vụ một tập tác nhân riêng, trong đó có sự giao thoa về dữ liệu nhưng không trùng lặp về quyền thao tác. Và các tác nhân chính của hệ thống gồm 3 tác nhân sau: 

## **Quản** 

**trị viên (Admin)** 

Quản trị viên là tác nhân chịu trách nhiệm vận hành và duy trì hệ thống ở cấp độ toàn cục. Đây không phải người tham gia trực tiếp vào hoạt động học tập của trẻ mà đóng vai trò thiết lập môi trường học. Thông qua Admin Site, quản trị viên quản lý tài khoản người dùng, cấu hình nội dung trò chơi, tổ chức kho dữ liệu cảm xúc (ảnh, video, bài tập) và theo dõi các báo cáo tổng hợp nhằm đánh giá mức độ sử dụng và hiệu quả chung của hệ thống. Các thao tác của quản trị viên mang tính kỹ thuật và quản lý, không tác động trực tiếp đến trải nghiệm tương tác của trẻ trong từng phiên chơi. 

## **Trẻ em (Child)** 

Trẻ em là tác nhân trung tâm và là đối tượng mà toàn bộ hệ thống hướng tới. Trẻ tương tác trực tiếp với User Site thông qua các trò chơi nhận diện cảm xúc bằng thao tác click và các bài tập biểu đạt cảm xúc qua camera. Các ca sử dụng của nhóm này được thiết kế tối giản, hạn chế thao tác phức tạp và không yêu cầu đọc hiểu nhiều chữ. Mọi tương tác của trẻ đều được hệ thống ghi nhận tự động để phục vụ chấm điểm, điều chỉnh độ khó và tạo báo cáo tiến trình. 

_42_ 

## **Phụ huynh, giáo viên** 

Phụ huynh và giáo viên là tác nhân gián tiếp nhưng có vai trò quyết định trong việc duy trì sử dụng hệ thống lâu dài. Nhóm này sử dụng cùng User Site với trẻ nhưng với mục đích khác: hướng dẫn trẻ học và chơi, kiểm tra nội dung trước khi cho trẻ chơi và theo dõi báo cáo tiến bộ. Trong nhiều trường hợp, phụ huynh hoặc giáo viên có thể trực tiếp thao tác các trò chơi để làm mẫu cho trẻ. Vì vậy, giao diện User Site cần đủ đơn giản cho trẻ nhưng vẫn đủ thông tin để người lớn hiểu và kiểm soát quá trình học. 

Bảng 3.2. Bảng tổng hợp tác nhân và phạm vi sử dụng 

|**Tác nhân**|**Phân hệ**<br>**truy cập**|**Vai trò chính**|**Ca sử dụng tiêu biểu**|
|---|---|---|---|
|Quản trị viên<br>(Admin)|Admin<br>Site|Quản lý và cấu<br>hình hệ thống|Quản lý tài khoản, tạo/sửa/xóa game, quản lý<br>nội dung cảm xúc, xem báo cáo tổng|
|Trẻ em (Child)|User Site|Người học trực<br>tiếp|Chơi game click, thực hiện bài tập camera,<br>nhận phản hồi và điểm thưởng|
|Phụ huynh, giáo<br>viên|User Site|Giám sát và hỗ<br>trợ|Đăng nhập, chọn bài học, hướng dẫn trẻ, xem<br>báo cáo tiến trình|



Hình dưới đây sẽ thực hiện mô tả tương tác giữa những tác nhân trong hệ thống này cùng với các ca sử dụng tương ứng của các tác nhân tương ứng. 

_43_ 

Hình 3.1. Biểu đồ ca sử dụng tổng quát hệ thống Emo Garden 

Trong phần tiếp theo báo cáo sẽ trình bày đặc tả chi tiết của ca sử dụng chính đã được hoàn thành trong hệ thống này. Những ca sử dụng dưới đây được thực hiện bởi các tác nhân mà báo cáo này tập trung trình bày. 

## **3.2 Ca sử dụng: Học và ôn tập các cảm xúc** 

Bảng 3.3.  Bảng đặc tả chi tiết cho ca sử dụng học và ôn tập các cảm xúc 

|**Tên ca sử dụng**|Học và ôn tập các cảm xúc|
|---|---|
|**Tác nhân**|Trẻ em (Người dùng)|



_44_ 

|**Mục tiêu**|Cho phép trẻ chủ động truy cập vào học và ôn tập các cảm xúc để<br>quan sát, ghi nhớ và hiểu rõ biểu hiện của một cảm xúc cụ thể<br>thông qua các thẻ học trực quan (hình ảnh, video minh họa), từ đó<br>hỗ trợ quá trình nhận diện và biểu đạt cảm xúc trong các trò chơi<br>tiếp theo.|
|---|---|
|**Điều kiện trước**|Người dùng đã đăng nhập vào hệ thống site User.|
|**Luồng sự kiện**|**+ Luồng chính**<br>1. Người dùng nhấn vào nút “Học” trên giao diện màn hình chính.<br>2. Hệ thống hiển thị danh sách các cảm xúc cơ bản dưới dạng các<br>thẻ học (Emotion Cards).<br>3. Người dùng chọn một cảm xúc cụ thể cần học.<br>4. Hệ thống mở thẻ học tương ứng và hiển thị nội dung minh họa,<br>bao gồm video biểu hiện cho cảm xúc đó, có thể bấm nút chuyển<br>để chuyển sang hình ảnh kèm tình huống thể hiện cảm xúc mô tả<br>ngắn gọn, dễ hiểu.<br>5. Người dùng quan sát nội dung thẻ học và có thể chuyển sang thẻ<br>tiếp theo hoặc chọn cảm xúc khác trong danh sách cảm xúc.<br>**+ Luồng thay thế**<br>4.1. Nếu hệ thống không tìm thấy dữ liệu video, ảnh cho cảm xúc<br>đó: Hệ thống hiển thị thông báo văn bản: "Hiện không có<br>video/thẻ học cho cảm xúc này. Vui lòng tiếp tục.". Người dùng<br>nhấn nút tiếp tục để bỏ qua.|
|**Điều kiện sau**|Người dùng có thể bấm vào biểu tượng đoạn chat ở góc dưới bên<br>phải để hỏi đáp với AI Chatbot|



_45_ 

## **3.3. Ca sử dụng: Luyện tập biểu hiện cảm xúc với Game Biểu Cảm** 

Bảng 3.4.  Bảng đặc tả chi tiết cho ca sử dụng luyện tập biểu hiện cảm xúc 

|**Tên ca sử dụng**|Luyện tập biểu hiện cảm xúc với Game Biểu Cảm|
|---|---|
|**Tác nhân**|Trẻ em (Người dùng)|
|**Mục tiêu**|Giúp trẻ thực hành cách biểu lộ cảm xúc trên khuôn mặt và nhận<br>phản hồi thời gian thực từ hệ thống AI.|
|**Điều kiện**<br>**trước**|1. Người dùng đã đăng nhập vào hệ thống.<br>2. Thiết bị có Camera hoạt động tốt và trình duyệt đã được cấp<br>quyền truy cập Camera.|



_46_ 

|**Luồng sự kiện**|**Luồng sự kiện**||
|---|---|---|
||**Luồng sự kiện**|**+ Luồng chính**<br>1. Người dùng bấm vào “Chơi game” sau đó chọn 1 trong 2 game<br>về biểu cảm, và chọn một trong 6 cảm xúc để chơi. .<br>2. Hệ thống hiển thị màn hình chơi gồm: Đề bài (Văn bản, hình<br>ảnh tình huống), nút bấm “Gợi ý” và “Bắt đầu” bên trái và khung<br>camera (đang ở trạng thái chờ) bên phải, sau đó đọc câu hỏi tình<br>huống lên.<br>3. Người dùng đọc, nghe đề bài và chuẩn bị biểu cảm.<br>4. Người dùng nhấn nút "Bắt đầu".<br>5. Hệ thống kích hoạt Camera, bắt đầu thu hình và phân tích khuôn<br>mặt người dùng theo thời gian thực.<br>6. Người dùng thực hiện biểu cảm khuôn mặt tương ứng với đề bài.<br>7. Hệ thống nhận diện cảm xúc khớp với yêu cầu (Độ chính xác đạt<br>ngưỡng quy định).<br>8. Hệ thống hiển thị thông báo "Xuất sắc", cộng điểm và tự động<br>chuyển sang câu hỏi tiếp theo đối với game Câu chuyện trên khuôn<br>mặt hoặc kết thúc lượt chơi với game Thử thách cảm xúc.<br>**+ Luồng thay thế**<br>5.1. Nếu người dùng chưa nhấn "Bắt đầu": Camera không kích<br>hoạt phân tích AI (tránh gây tải hệ thống và áp lực cho trẻ khi chưa<br>chuẩn bị xong).<br>7.1. Nếu hệ thống nhận diện cảm xúc thể hiện sai hoặc không phát<br>hiện khuôn mặt cho đến khi hết thời gian của câu hỏi:<br>- Hệ thống thông báo trẻ chưa thể hiện tốt<br>- Tính là 1 lần sai (Error Count + 1).<br>7.2. Nếu số lần sai đạt giới hạn (Max Errors):<br>- Hệ thống dừng phiên phân tích Camera.|



_47_ 

- Hệ thống hiển thị Popup "Góc học tập" chứa video mẫu về cách biểu hiện cảm xúc đó. - Người dùng xem xong và nhấn "Đã hiểu" để quay lại màn hình game và thử lại. 

_48_ 

||**Điều kiện sau**|1. Kết quả phiên chơi (Điểm số, các cảm xúc đã làm được, mảng tỉ<br>lệ cảm xúc, thông tin phiên chơi) được lưu và cập nhật vào cơ sở<br>dữ liệu.<br>2. Cập nhật tiến độ chơi của trẻ trên Dashboard.|
|---|---|---|



## **3.4. Ca sử dụng: Luyện tập nhận diện và ôn tập cảm xúc với Game Click** 

Bảng 3.5.  Bảng đặc tả chi tiết cho ca sử dụng luyện tập nhận diện và ôn tập cảm xúc 

|||
|---|---|
|**Tên ca sử dụng**|Luyện tập nhận diện và ôn tập cảm xúc với Game Click|
|**Tác nhân**|Trẻ em (Người dùng)|
|**Mục tiêu**|Giúp trẻ ôn tập cảm xúc, rèn luyện khả năng quan sát và nhận diện<br>cảm xúc thông qua các câu hỏi trắc nghiệm hình ảnh, tình huống,<br>từ đó củng cố kiến thức về các trạng thái cảm xúc.|
|**Điều kiện**<br>**trước**|Người dùng đã đăng nhập vào hệ thống site User.|



_49_ 

|**Luồng sự kiện**|**Luồng sự kiện**||
|---|---|---|
||**Luồng sự kiện**|**+ Luồng chính**<br>1. Người dùng nhấn vào nút “Chơi game”, chọn nhóm "Game<br>Click", sau đó chọn 1 trong 4 game cụ thể.<br>2. Hệ thống hiển thị danh sách các Cấp độ (Level) từ dễ đến khó<br>(Level 1 - 8).<br>3. Người dùng chọn một Level để bắt đầu.<br>4. Hệ thống hiển thị màn hình chơi gồm: Nội dung câu hỏi (Hình<br>ảnh, tình huống) và các phương án trả lời (Nút bấm) tùy theo mỗi<br>game cụ thể.<br>5. Người dùng quan sát câu hỏi và nhấn chọn phương án trả lời.<br>6. Hệ thống kiểm tra đáp án:<br>- Nếu Đúng: Hệ thống phát âm thanh chúc mừng, hiển thị thông<br>báo "Chính xác", cộng điểm và đợi người dùng bấm chuyển sang<br>câu hỏi tiếp theo (hoặc kết thúc nếu là câu cuối).<br>**+ Luồng thay thế**<br>4.1. Sử dụng hỗ trợ:<br>- Người dùng nhấn nút "Nghe câu hỏi": Hệ thống phát âm thanh<br>đọc nội dung câu hỏi.<br>- Người dùng nhấn nút "Gợi ý": Hệ thống hiển thị văn bản gợi ý<br>để trẻ dễ đoán hơn.<br>6.1. Nếu trả lời Sai:<br>- Hệ thống phát âm thanh báo sai, hiển thị thông báo động viên<br>và đánh dấu đáp án vừa chọn là sai.<br>- Tính là 1 lần sai (Error Count + 1) cho cảm xúc đó.<br>6.2. Kích hoạt Góc học tập (Khi sai đạt ngưỡng Max Errors):<br>- Nếu số lần sai của một cảm xúc cụ thể đạt giới hạn quy định.|



_50_ 

||- Hệ thống hiển thị Popup "Góc học tập" ngay lập tức, chứa<br>video/ảnh giải thích về cảm xúc mà trẻ vừa sai.<br>- Người dùng xem xong và nhấn "Đã hiểu, tiếp tục chơi nào!" để<br>đóng popup và tiếp tục làm bài.|
|---|---|
|**Điều kiện sau**|1. Kết quả phiên chơi (Điểm số, các cảm xúc đã làm được, mảng tỉ<br>lệ cảm xúc, thông tin phiên chơi) được lưu và cập nhật vào cơ sở<br>dữ liệu.<br>2. Cập nhật tiến độ học tập và mở khóa Level tiếp theo (nếu đạt đủ<br>điểm) trên Dashboard.|



## **3.5 Ca sử dụng:  Tạo báo cáo** 

Bảng 3.6.  Bảng đặc tả chi tiết cho ca sử dụng tạo báo cáo 

_51_ 

|**Tên ca sử dụng**|Tạo báo cáo kết quả học tập (Tuần, tháng)|
|---|---|
|**Tác nhân**|Người dùng (Phụ huynh, giáo viên)|
|**Mục tiêu**|Cho phép người dùng chủ động tạo và nhận bản tổng hợp chi tiết<br>về tiến độ, điểm số, thời gian chơi và các cảm xúc cần cải thiện<br>của trẻ trong một khoảng thời gian nhất định.|
|**Điều kiện trước**|1. Người dùng đã đăng nhập vào hệ thống.<br>2. Tài khoản của trẻ đã có dữ liệu chơi game trong khoảng thời<br>gian muốn báo cáo.|
|**Luồng sự kiện**|**+ Luồng chính**<br>1. Tại giao diện màn hình chính, người dùng nhấn vào biểu tượng<br>người dùng ở góc trên bên phải.<br>2. Hệ thống chuyển hướng đến trang thông tin người dùng.<br>3. Người dùng cuộn xuống phần Báo cáo tiến độ.<br>4. Người dùng lựa chọn loại báo cáo mong muốn: "Báo cáo tuần<br>này" hoặc "Báo cáo tháng này".<br>5. Người dùng nhấn nút "Xác nhận".<br>6. Hệ thống tiến hành thu thập dữ liệu chơi game của trẻ trong<br>khoảng thời gian đã chọn, phân tích và tổng hợp kết quả.<br>7. Hệ thống hiển thị thông báo "Tạo báo cáo thành công" và gửi<br>bản báo cáo chi tiết về địa chỉ Email đã đăng ký của người dùng.<br>**+ Luồng thay thế**<br>6.1. Không có dữ liệu:<br>- Nếu trong tuần/tháng đó trẻ chưa chơi game nào.|



_52_ 

||- Hệ thống hiển thị thông báo: "Chưa có dữ liệu hoạt động trong<br>thời gian này để tạo báo cáo.".<br>- Kết thúc ca sử dụng.|
|---|---|
|**Điều kiện sau**|1. Một bản ghi báo cáo mới được lưu vào hệ thống (lịch sử báo<br>cáo).<br>2. Người dùng nhận được thông tin chi tiết để đánh giá sự tiến bộ<br>của trẻ.|



_53_ 

## **3.6 Ca sử dụng: Sử dụng Chatbot** 

Bảng 3.7.  Bảng đặc tả chi tiết cho ca sử dụng sử dụng Chatbot 

|Bảng|3.7.  Bảng đặc tả chi tiết cho ca sử dụng sử dụng Chatbot|
|---|---|
|**Tên ca sử dụng**|Sử dụng Chatbot hỗ trợ (Hỏi đáp AI)|
|**Tác nhân**|Người dùng (Chủ yếu là phụ huynh, giáo viên, ngoài ra trẻ cũng<br>có thể sử dụng)|
|**Mục tiêu**|Cung cấp kênh hỗ trợ tức thì để người dùng giải đáp thắc mắc về<br>cách chơi, ý nghĩa cảm xúc, hoặc tìm kiếm thông tin liên quan về<br>hệ thống web thông qua giao diện hội thoại tự nhiên với AI.|
|**Điều kiện trước**|1. Người dùng đã đăng nhập vào site User.<br>2. Kết nối mạng ổn định.|
|**Luồng sự kiện**|**+ Luồng chính**<br>1. Tại bất kỳ màn hình nào (Trang chủ, Màn hình game, Góc học<br>tập, thông tin cá nhân), người dùng nhấn vào biểu tượng đoạn chat<br>(Bubble Chat) ở góc dưới bên phải màn hình.<br>2. Hệ thống mở cửa sổ Chatbot.<br>3. Hệ thống hiển thị lời chào mặc định: “Chào bé! Mình là trợ lý<br>EmoGarden, có thể giúp bé hiểu cách chơi game này.”<br>4. Người dùng nhập câu hỏi vào ô văn bản và nhấn Gửi hoặc sử<br>dụng chức năng nói thông qua biểu tượng micro<br>5. Hệ thống AI xử lý câu hỏi, truy xuất cơ sở dữ liệu kiến thức.<br>6. Hệ thống hiển thị câu trả lời phản hồi cho người dùng trong cửa<br>sổ chat.<br>7. Người dùng có thể tiếp tục đặt câu hỏi khác hoặc nhấn nút đóng<br>để thu nhỏ cửa sổ chat.|



_54_ 

|||
|---|---|
||**+ Luồng thay thế**<br>5.1. Câu hỏi ngoài phạm vi:<br>- Nếu câu hỏi không liên quan đến hệ thống hoặc AI không<br>hiểu.<br>- Hệ thống phản hồi: "Not Found".|
|**Điều kiện sau**|Người dùng nhận được thông tin cần thiết để tiếp tục sử dụng hệ<br>thống hiệu quả hơn.|



_55_ 

## **CHƯƠNG IV: THIẾT KẾ HỆ THỐNG** 

## **1. Thiết kế mức cao của hệ thống** 

## **1.1 Kiến trúc hệ thống** 

Hệ thống hỗ trợ phát triển trí tuệ cảm xúc được thiết kế theo kiến trúc 3 lớp trên nền tảng Web, tuân thủ mô hình **Client - Server** hiện đại. Ba lớp gồm: **Khối giao diện** (Client), **khối máy chủ** (Server), và **khối dữ liệu** (Database). 

Khối giao diện tập trung vào việc tạo môi trường tương tác rõ ràng, ổn định và nhất quán cho trẻ trong tất cả các hoạt động: luyện nhận diện cảm xúc với game Click, luyện biểu đạt cảm xúc qua camera, sử dụng chatbot đơn giản hoặc xem phần thưởng. Do trẻ ASD rất nhạy với sự gián đoạn, giao diện chỉ xử lý các tác vụ nhẹ như nén ảnh, cắt vùng mặt và thu nhận thao tác click, sau đó gửi đi các dữ liệu đã tinh gọn. Cách tổ chức này đảm bảo vòng phản hồi luôn nhanh, không gây đứt mạch chú ý và duy trì sự ổn định khi chuyển giữa các bài tập. 

Khối máy chủ xử lý các tác vụ nặng, bao gồm phân tích hình ảnh, kiểm tra đáp án trong game Click, sinh phản hồi cho chatbot, chấm điểm, và điều khiển dòng bài học. Máy chủ hoạt động bất đồng bộ để tránh tắc nghẽn khi đồng thời nhận luồng hình ảnh thời gian thực và xử lý nhiều yêu cầu khác (như ghi log, tính tiến độ). Việc tách biệt khối này cho phép nâng cấp mô hình AI, cải tiến thuật toán gamification hoặc bổ sung dạng bài mới mà không cần thay đổi giao diện. 

Khối dữ liệu đảm nhiệm lưu trữ toàn bộ tiến độ của trẻ ở nhiều dạng bài khác nhau chứ không chỉ dữ liệu từ camera. Các bản ghi bao gồm thao tác click, thời gian trả lời, kết quả nhận diện cảm xúc, lịch sử phiên chơi, và các cấu hình cá nhân hóa. Dữ liệu được tổ chức theo chuỗi thời gian để phục vụ báo cáo và theo dõi tiến bộ dài hạn. Hệ thống chỉ lưu trữ các đặc trưng cần thiết, tránh lưu hình ảnh gốc nhằm giảm rủi ro về dữ liệu nhạy cảm. 

Sự phân tách này mang lại nhiều lợi ích cốt lõi cho một hệ thống tương tác thời gian thực: 

- **Tính độc lập:** Việc tách biệt giao diện và xử lý AI cho phép cập nhật các mô hình nhận diện cảm xúc mới, cải tiến game hoặc chatbot mà không làm gián đoạn trải nghiệm người dùng trên trình duyệt. 

- **Tính linh hoạt:** Dễ dàng mở rộng hoặc thay thế các thành phần. Ví dụ, có thể nâng cấp từ mô hình DeepFace sang các kiến trúc CNN phức tạp hơn, cải tiến mô hình ngôn ngữ 

_56_ 

lớn LLM cho Chatbot tốt hơn ở phía server mà không yêu cầu người dùng phải nâng cấp thiết bị. 

- **Tính hiệu năng:** Khối Client tập trung vào việc hiển thị và thu nhận hình ảnh, trong khi các tác vụ liên quan đến logic nghiệp vụ, tính toán nặng được đẩy về khối Backend, giúp hệ thống vận hành mượt mà trên các máy tính cấu hình phổ thông. 

## **1.2 Các thành phần chính** 

Như đã trình bày ở phần trước, kiến trúc hệ thống được thiết kế theo mô hình Client - Server, gồm ba thành phần cốt lõi: khối Client, khối máy chủ (Backend) và khối cơ sở dữ liệu. Việc phân tách theo lớp giúp hệ thống đảm bảo đồng thời ba tiêu chí quan trọng trong bối cảnh ứng dụng cho trẻ ASD: ổn định tương tác, độ trễ thấp và khả năng mở rộng. 

## **Khối Client (Frontend)** 

- **Mô tả:** Khối Client là ứng dụng Web chạy trực tiếp trên trình duyệt, đóng vai trò là không gian tương tác chính của trẻ. Tại đây, người dùng thực hiện các hoạt động học và luyện tập cảm xúc như: chơi các mini-game dạng click (ôn luyện nhận diện), chơi game camera (luyện biểu đạt), xem nội dung thẻ học cảm xúc và tương tác với chatbot hỗ trợ. Giao diện được định hướng tối giản nhằm giảm tải nhận thức, hạn chế hiệu ứng gây nhiễu và duy trì sự nhất quán để trẻ dễ hình thành “mô hình tinh thần” khi sử dụng. 

- **Công nghệ:** Frontend được xây dựng theo hướng web module với **HTML/CSS/JavaScript** và sử dụng Vite làm công cụ đóng gói và phát triển. Đối với bài luyện camera, hệ thống truy cập webcam bằng **MediaDevices API (getUserMedia)** và thực hiện nhận diện biểu cảm ngay trên trình duyệt thông qua thư viện **face-api.js** (mô hình tiền huấn luyện). Client giao tiếp với backend thông qua các API để lấy dữ liệu bài luyện, tạo, kết thúc phiên và gửi kết quả theo dạng dữ liệu định lượng. 

- **Vai trò:** Khối Client chịu trách nhiệm: 

   - Thu nhận tín hiệu đầu vào của người dùng (thao tác chọn đáp án, thao tác điều hướng và luồng video camera). 

   - Cập nhật phản hồi tức thời trên giao diện: Hiển thị kết quả đúng, sai với hiệu ứng trực quan (đèn xanh, vàng, đỏ), gợi ý và hướng dẫn bằng text và giọng đọc (Text-to-Speech), trạng thái tiến độ (màn chơi hiện tại, điểm số, thời gian còn lại). 

_57_ 

- Với game camera, Client đảm nhiệm vòng lặp thời gian thực: Hiển thị video từ webcam, lấy mẫu khung hình (mỗi 200ms), suy luận biểu cảm trực tiếp trên trình duyệt bằng thư viện Face-API.js (không gửi hình ảnh lên server), cập nhật phản hồi trực quan (thanh tiến độ confidence, đèn tín hiệu, thông báo, yếu tố then chốt đối với tương tác học tập của trẻ ASD. 

## **Khối máy chủ (Backend)** 

- **Mô tả:** Khối máy chủ là trung tâm xử lý nghiệp vụ của hệ thống. Backend tiếp nhận yêu cầu từ client, điều phối luồng học tập và đảm bảo dữ liệu tiến độ được ghi nhận nhất quán. Ngoài các chức năng quản lý phiên chơi và chấm điểm, backend cung cấp dịch vụ chatbot nhằm hướng dẫn sử dụng và giải thích luật chơi theo ngữ cảnh. 

- **Công nghệ:** Backend được xây dựng bằng Python với framework FastAPI. Dịch vụ chatbot tích hợp **Google Generative AI (Gemini)** , kết hợp cơ chế prompt có kiểm soát và kho hướng dẫn theo từng trò chơi (rule-base) để đảm bảo câu trả lời đúng phạm vi và phù hợp người dùng. 

- **Vai trò:** Khối Backend chịu trách nhiệm: 

   - Cung cấp dữ liệu trò chơi: Câu hỏi, tình huống, yêu cầu biểu cảm được phân theo level và loại game. 

   - Quản lý phiên chơi: Tạo session khi bắt đầu, kết thúc session khi hoàn thành, tổng hợp kết quả và cập nhật tiến độ người chơi. 

   - Lưu trữ và tổng hợp dữ liệu: Phục vụ tạo báo cáo tiến độ học tập gửi cho phụ huynh. 

   - Xử lý chatbot hỗ trợ: Tích hợp Google Gemini AI để trả lời câu hỏi theo ngữ cảnh từng game, kèm cơ chế phản hồi dự phòng (fallback) khi dịch vụ AI không khả dụng. 

   - Gửi email: Xác thực OTP và gửi báo cáo PDF qua Gmail SMTP. 

_58_ 

## **Khối cơ sở dữ liệu (Database)** 

- **Mô tả:** Khối cơ sở dữ liệu là nơi lưu trữ bền vững toàn bộ thông tin người dùng và lịch sử tương tác trong quá trình học/luyện cảm xúc. Dữ liệu được tổ chức nhằm phục vụ thống kê theo phiên và theo chuỗi thời gian, từ đó hỗ trợ theo dõi tiến bộ dài hạn. 

- **Công nghệ:** Hệ thống sử dụng SQL Server (cơ sở dữ liệu quan hệ) để lưu trữ thông tin tài khoản, hồ sơ trẻ, lịch sử phiên chơi và các chỉ số tiến độ. 

- **Vai trò:** Cơ sở dữ liệu lưu các nhóm thông tin chính: 

   - Thông tin người dùng: Tài khoản (admin/trẻ em), hồ sơ cá nhân (tên, tuổi,  giới tính, email). 

   - Lịch sử phiên chơi: Kết quả từng câu hỏi (đúng/sai), cảm xúc mục tiêu, thời gian phản hồi, độ chính xác nhận diện. 

   - Tiến độ học tập: Điểm số, level hiện tại, tỷ lệ đúng/sai theo từng cảm xúc - phục vụ cá nhân hóa lộ trình học. 

   - Nội dung game: Câu hỏi, tình huống, thẻ học cảm xúc (video, ảnh, mô tả). 

   - Báo cáo: Lịch sử báo cáo đã tạo và gửi cho phụ huynh. 

## **1.3 Mối quan hệ tương tác** 

Các thành phần trong hệ thống phối hợp với nhau thông qua các giao thức phù hợp với từng loại dữ liệu: dữ liệu ảnh thời gian thực, thao tác click, dữ liệu báo cáo và yêu cầu từ chatbot. Việc tách riêng từng kênh truyền giúp hệ thống duy trì tốc độ phản hồi ổn định và hạn chế tắc nghẽn trong các bài tập vốn nhạy về thời gian. 

## **Tương tác Client - Server:** 

- **Giao thức:** Hệ thống sử dụng kết hợp **HTTP/HTTPS** cho các thao tác không yêu cầu thời gian thực (đăng nhập, lấy danh sách bài học, truy vấn báo cáo, lấy dữ liệu cấu hình) và **WebSocket** cho các tác vụ cần truyền dữ liệu liên tục như gửi khung hình trong game camera hoặc nhận luồng phản hồi tức thì. 

- **Giao diện:** Server cung cấp các điểm truy cập API để Client gọi bằng axios trong các chức năng quản lý, đồng thời cung cấp các điểm WebSocket cho các luồng thời gian thực như luyện biểu đạt cảm xúc hoặc theo dõi tiến độ theo từng giây. Client sử dụng **socket.io-client** để duy trì kết nối hai chiều ổn định. 

_59_ 

## ● **Định dạng dữ liệu:** 

- Với dữ liệu hình ảnh, Client nén và mã hóa khung hình thành Base64 trước khi gửi, phù hợp băng thông của các thiết bị gia đình. 

- Với game Click hoặc các thao tác không liên quan đến ảnh, Client gửi gọn dữ liệu dạng JSON, bao gồm đáp án trẻ chọn, thời gian thao tác, và trạng thái bài học. 

- Backend trả về dữ liệu theo chuẩn JSON, gồm kết quả phân loại cảm xúc, trạng thái đúng, sai, điểm thưởng hoặc hướng dẫn tiếp theo. 

## **Tương tác Server - Database:** 

- Giao thức: Server giao tiếp trực tiếp với hệ quản trị cơ sở dữ liệu thông qua kết nối ổn định và tái sử dụng kết nối để tránh tạo tải lớn khi lưu log liên tục. 

- Giao diện: Sử dụng **ORM SQLAlchemy** để truy vấn, ghi log và cập nhật tiến độ một cách an toàn và nhất quán. ORM giúp mã nguồn rõ ràng, dễ bảo trì và cho phép mở rộng bảng dữ liệu khi thêm chức năng mới như thống kê chi tiết hoặc theo dõi sai thường gặp theo từng cảm xúc. 

## **1.4 Quy trình xử lý dữ liệu** 

Để minh họa khả năng xử lý thời gian thực trong module Game CV (Gương thông minh), phần này mô tả luồng nghiệp vụ điển hình khi trẻ thực hiện một biểu cảm (ví dụ: cười, vui) theo yêu cầu của bài luyện. Quy trình được thiết kế theo mô hình vòng lặp phản hồi khép kín: hành động → phân tích → phản hồi → điều chỉnh, trong đó ưu tiên độ trễ thấp và tính ổn định tương tác. 

## **1. Khởi tạo bài luyện và thiết lập phiên** 

Quá trình bắt đầu khi Client kết nối với Backend để tải cấu hình bài luyện (dưới dạng các tình huống theo cấp độ hoặc yêu cầu cụ thể) và khởi tạo một phiên làm việc mới. Tại bước này, hệ thống cấp một định danh duy nhất (session_id), đóng vai trò là khóa chính xuyên suốt để liên kết mọi dữ liệu tương tác sau này. Việc quản lý theo session giúp hệ thống ghi nhận kết quả chính xác cho từng lượt học, phục vụ cho việc thống kê tiến độ và trích xuất báo cáo sau này. 

_60_ 

## **2. Thu nhận dữ liệu hình ảnh** 

Hệ thống sử dụng API getUserMedia để xin quyền truy cập camera, chuyển đổi màn hình thiết bị thành một "chiếc gương kỹ thuật số". Việc hiển thị luồng video trực tiếp giúp trẻ quan sát và tự điều chỉnh khuôn mặt trong thời gian thực. Để phù hợp với đối tượng trẻ rối loạn phổ tự kỷ, giao diện được thiết kế ưu tiên sự ổn định: khung camera cố định và các tín hiệu phản hồi trực quan được bố trí rõ ràng, tránh các thay đổi đột ngột gây xao nhãng hoặc tạo cảm giác "lỗi" kỹ thuật. 

## **3. Tải mô hình và suy luận tại biên** 

Thay vì gửi liên tục luồng video về máy chủ (gây độ trễ mạng và rủi ro quyền riêng tư), Emo Garden triển khai pipeline nhận diện cảm xúc ngay trên trình duyệt (Client-side) sử dụng thư viện face-api.js. Hệ thống ưu tiên tải mô hình từ nguồn cục bộ và tự động chuyển sang CDN nếu cần thiết để đảm bảo tính sẵn sàng. 

Quy trình xử lý thị giác máy tính diễn ra theo trình tự lặp lại với chu kỳ ngắn, đảm bảo độ mượt mà không gây quá tải CPU: 

- **Phát hiện khuôn mặt:** Xác định và khoanh vùng khuôn mặt trong khung hình. 

- **Trích xuất đặc trưng:** Định vị các điểm mốc hình học (landmarks) trên vùng mắt, mũi, miệng. 

- **Ước lượng biểu cảm:** Tính toán phân phối xác suất và ánh xạ về 6 nhóm cảm xúc mục tiêu thống nhất trong hệ thống (vui, buồn, tức giận, sợ hãi, ngạc nhiên, ghê tởm). 

## **4. Đánh giá điều kiện đạt và cơ chế ổn định theo thời gian** 

Hệ thống không đánh giá kết quả "Đúng, Sai" dựa trên một khung hình đơn lẻ ngẫu nhiên nhằm loại bỏ nhiễu do cử động vô tình. Thay vào đó, thuật toán áp dụng cơ chế kiểm tra ngưỡng tin cậy (confidence threshold) kết hợp với độ ổn định theo thời gian. Trẻ chỉ được công nhận hoàn thành bài luyện khi biểu cảm mục tiêu (target_emotion) đạt đủ độ rõ ràng và được duy trì liên tục trong một khoảng thời gian quy định. Ngưỡng đánh giá này được thiết kế động, có thể tăng dần theo độ khó (Level) để phù hợp với lộ trình tiến bộ của trẻ. 

## **5. Phản hồi giao diện thời gian thực** 

Trong suốt quá trình nhận diện, giao diện đóng vai trò người hướng dẫn với cơ chế phản hồi liên tục. Hệ thống cập nhật các chỉ số trực quan như biểu tượng cảm xúc đang phát hiện, thanh phần trăm độ tin cậy và trạng thái đánh giá (Chưa giống, gần đúng, chính xác) ngay lập 

_61_ 

tức. Cơ chế này được thiết kế theo hướng giáo dục tích cực: khi trẻ chưa đạt, hệ thống đưa ra tín hiệu khuyến khích "thử lại" nhẹ nhàng thay vì thông báo thất bại, giúp trẻ duy trì động lực và sự tập trung. 

## **6. Ghi nhận kết quả và đồng bộ dữ liệu** 

Khi một tình huống kết thúc (dù đạt hay không đạt), Client đóng gói kết quả xử lý và gửi về Backend thông qua API. Điểm quan trọng của quy trình này là hệ thống hoàn toàn không gửi hình ảnh hay video thô lên Server, đảm bảo tuyệt đối quyền riêng tư cho trẻ. Dữ liệu gửi đi chỉ bao gồm các metadata nghiệp vụ để phục vụ phân tích: 

- **Thông tin định danh:** session_id, scenario_id. 

- **Dữ liệu cảm xúc** : target_emotion (mục tiêu), detected_emotion (kết quả nhận diện). 

- **Chỉ số hiệu suất:** success (trạng thái), time_taken (thời gian), confidence_score (điểm tin cậy quy đổi 0-100). 

- **Hành vi hỗ trợ** : check_hint (trạng thái sử dụng gợi ý). 

## **7. Lưu trữ và tổng hợp trên Database** 

Backend tiếp nhận gói tin dữ liệu và lưu trữ vào cơ sở dữ liệu quan hệ. Tại đây, dữ liệu thô được chuyển hóa thành thông tin có ý nghĩa giáo dục: tổng hợp điểm số của phiên chơi, phân tích tỷ lệ lỗi theo từng loại cảm xúc (emotion_errors) để xác định các biểu cảm trẻ đang gặp khó khăn. Đây là nguồn dữ liệu đầu vào quan trọng để hệ thống cá nhân hóa lộ trình học và tạo báo cáo gửi phụ huynh. 

## **8. Kết thúc phiên chơi và trả tổng kết** 

Quy trình khép lại khi người chơi hoàn thành chuỗi bài tập hoặc chủ động dừng lại. Client gọi API kết thúc phiên, nhận về bảng tổng kết chi tiết từ Server (điểm số, biểu đồ lỗi, lời khuyên) để hiển thị lên màn hình. Bước này giúp củng cố kiến thức và cung cấp cái nhìn tổng quan về hiệu quả của buổi luyện tập cho người giám hộ. 

## **1.5 Thiết kế thuật toán chấm điểm và cơ chế Gamification** 

Trong hệ thống, Gamification không được sử dụng như một lớp trang trí, mà là cơ chế dẫn dắt hành vi và tạo cấu trúc học tập bền vững cho trẻ ASD. Mọi thành phần chấm điểm, phản hồi và mở khóa đều được tối giản để tránh gây nhiễu, nhưng vẫn phải đủ rõ ràng để trẻ nhận biết được sự tiến bộ của mình. 

_62_ 

## **1.5.1 Thuật toán chấm điểm** 

Thuật toán chấm điểm của hệ thống được chia theo hai loại bài tập: nhóm bài tập tương tác qua camera và nhóm game click. Tuy khác nhau về hình thức, nhưng cả hai đều tuân theo nguyên tắc kết hợp độ chính xác và tốc độ nhằm khuyến khích trẻ phản ứng nhanh và đúng. 

## **1. Đối với game CV (biểu đạt cảm xúc)** 

Có 2 cơ chế chấm điểm theo hai hình thức luyện tập. Trong nhóm bài tương tác camera, hệ thống sử dụng một chỉ số trung tâm là độ khớp biểu cảm (%), phản ánh mức độ biểu cảm của trẻ phù hợp với cảm xúc mục tiêu tại thời điểm thực hiện. Chỉ số này được dùng theo hai cơ chế khác nhau tương ứng với hai hình thức Game CV. 

- **Game CV “Thử thách cảm xúc’’:** lưu và đánh giá theo % tốt nhất 

   - Ở hình thức luyện tập theo yêu cầu, mỗi lượt chơi tập trung vào việc trẻ thể hiện đúng từng cảm xúc mục tiêu. Do đó, gamification không đặt nặng “qua màn nhanh”, mà nhấn mạnh cải thiện chất lượng biểu cảm. 

   - **Nguyên tắc chấm:** với mỗi cảm xúc, hệ thống ghi nhận mức % cao nhất mà trẻ từng đạt được khi thể hiện đúng cảm xúc đó (coi như “điểm tốt nhất” của cảm xúc). 

   - **Ý nghĩa gamification:** trẻ có thể thấy rõ “mình đang tiến bộ” vì điểm % có thể tăng dần qua nhiều lần thử, không bị áp lực phải đúng ngay lập tức. 

   - **Tổng kết tiến độ:** mức độ tiến bộ chung của phiên/lượt chơi được phản ánh thông qua việc tổng hợp các % tốt nhất của các cảm xúc (đại diện cho mức thành thạo theo từng nhóm cảm xúc). 

- **Game CV “Câu chuyện trên khuôn mặt”** : % là điều kiện qua màn, điểm là số màn vượt qua 

   - Ở hình thức luyện tập theo tình huống, mục tiêu là giúp trẻ phản ứng đúng cảm xúc trong ngữ cảnh, vì vậy hệ thống áp dụng cơ chế “đạt ngưỡng để qua màn”. 

   - **Điều kiện qua màn:** trẻ cần đạt độ khớp (%) tối thiểu theo mức độ (level). Nếu % chưa đạt ngưỡng, màn được xem là chưa hoàn thành và trẻ cần thử lại. 

_63_ 

- **Cách tính điểm:** khi đạt điều kiện qua màn, hệ thống cộng 1 điểm cho mỗi màn vượt qua. Điểm phiên chơi vì vậy phản ánh trực tiếp số lượng tình huống trẻ xử lý đúng. 

- Và sau khi kết thúc session chơi, số điểm đó là điều kiện để kiểm tra xem có vượt qua được level đó, mở level tiếp theo hay không. 

- **Vai trò thời gian:** thời gian để đạt ngưỡng được ghi nhận nhằm đánh giá mức độ phản ứng và hỗ trợ theo dõi tiến bộ, nhưng hệ thống vẫn ưu tiên trải nghiệm “rõ ràng – ít áp lực” (không biến chậm thành một hình phạt điểm quá mạnh). 

## 2. **Đối với game click (ôn tập nhận diện cảm xúc)** 

Điểm trong trường hợp này được tính theo đúng, sai, không phụ thuộc vào AI. Với mỗi câu hỏi đúng, trẻ được cộng thêm 10 điểm tương ứng. Và sau khi kết thúc session chơi, số điểm đó là điều kiện để kiểm tra xem có vượt qua được level đó, mở level tiếp theo hay không. 

## **1.5.2 Luồng phản hồi Gamification:** 

Hệ thống áp dụng vòng phản hồi ngắn, nhanh, rõ ràng, phù hợp với đặc điểm chú ý của trẻ ASD. 

- **Kích hoạt và phản hồi:** Khi trẻ trả lời đúng hoặc sai, hệ thống kích hoạt phản hồi ngay lập tức theo từng trường hợp đúng sai: 

   - Trả lời đúng: hiển thị popup chúc mừng trẻ đã trả lời đúng, có button để chuyển xang câu tiếp theo hoặc xem lại câu hỏi. 

   - Trả lời sai: hiển thị popup trả lời sai, cùng đáp án đúng cho câu hỏi. Nếu cảm xúc sai đó đạt max error được cập nhật theo tiến trình của từng cá nhân thì sẽ cần phải cho trẻ ôn tập lại cảm xúc này. Khi đó, popup hiển thị đáp án đúng, và có button điều hướng trẻ đến hiển thị thẻ học cho cảm xúc cần được ôn tập, ở đây cụ thể là ôn tập lại qua video. 

- **Phản hồi:** Gồm hiệu ứng hình ảnh đơn giản (hiển thị và âm thanh ngắn. Mức độ kích thích được giới hạn để tránh gây quá tải giác quan. 

- **Tích lũy:** Tất cả điểm số từ mỗi câu hỏi trong lượt chơi đều được cộng dồn vào điểm số tổng. Khi điểm số tổng thỏa mãn điều kiện điểm ngưỡng yêu cầu của mỗi level, trẻ 

_64_ 

mở khóa một cấp độ tiếp theo. Cách làm này tạo khung tiến bộ rõ ràng mà không gây áp lực. 

- **Điều chỉnh tỉ lệ câu hỏi để cá nhân hóa cho từng trẻ:** Sau khi trẻ chơi xong 1 lượt chơi, hệ thống sẽ thực hiện tính lại tỉ lệ các câu hỏi cho 6 loại cảm xúc như sau: tăng tỉ lệ đối với các cảm xúc sai cùng với đó là giảm tỉ lệ đối với các cảm xúc đúng, đảm bảo tổng tỉ lệ là 100%. Với cơ chế này, khi level mới được mở, hệ thống sẽ cập nhật bộ câu hỏi theo tỉ lệ các cảm xúc được tính riêng cho từng trẻ tại từng thời điểm, giúp cho quá trình ôn tập của trẻ được hiệu quả hơn. 

## **1.6 Thiết kế luồng xử lý Chatbot thông minh** 

Khác với các module xử lý ảnh (Computer Vision) vốn dựa trên các tác vụ suy luận thị giác nặng, module Chatbot trong hệ thống EmoGarden tập trung giải quyết bài toán xử lý ngôn ngữ tự nhiên (NLP) gắn liền với ngữ cảnh. Chatbot được định vị không phải là một công cụ đàm thoại tự do (Open-domain chatbot), mà đóng vai trò là một trợ lý hướng dẫn (Virtual Guide) chuyên biệt. Mục tiêu thiết kế là cung cấp các phản hồi ngắn gọn, dễ hiểu và bám sát tình huống hiện tại, giúp tháo gỡ khó khăn cho trẻ và phụ huynh mà không làm gián đoạn dòng chảy trải nghiệm ứng dụng. 

## **1. Tiếp nhận dữ liệu đầu vào tại Client (Web UI)** 

Tại tầng giao diện (Frontend), Chatbot được xây dựng bằng Vanilla JavaScript dưới dạng một widget nổi để tối ưu hóa hiệu năng và giảm phụ thuộc vào các thư viện bên thứ ba. Hệ thống thiết kế hai phương thức nhập liệu song song nhằm tối đa hóa khả năng tiếp cận: 

- **Nhập liệu văn bản:** Dành cho phụ huynh hoặc trẻ đã có kỹ năng đọc viết tốt. 

- **Nhập liệu giọng nói:** Tích hợp Web Speech Recognition (API nhận dạng giọng nói của trình duyệt) để chuyển đổi lời nói thành văn bản. Tính năng này đặc biệt quan trọng với trẻ nhỏ hoặc trẻ có hạn chế về vận động tinh, giúp gỡ bỏ rào cản giao tiếp bằng bàn phím, tạo cảm giác tương tác tự nhiên. 

Điểm đột phá trong thiết kế Frontend là cơ chế Tự động ngữ cảnh hóa (Contextawareness). Khi người dùng gửi yêu cầu, hệ thống tự động trích xuất metadata từ URL để "hiểu" vị trí hiện tại mà không cần người dùng mô tả: 

- game_id: Xác định trò chơi cụ thể (ánh xạ từ tên file HTML). 

- level: Xác định cấp độ khó (trích xuất từ query parameter). 

_65_ 

## **2. Tiếp nhận và chuẩn hóa tại Backend (FastAPI)** 

Máy chủ tiếp nhận yêu cầu thông qua API POST /assistant/chat. Tại đây, Backend đóng vai trò là Bộ điều phối (Orchestrator) trung tâm, đảm bảo tính toàn vẹn và an toàn của dữ liệu trước khi chuyển tiếp đến mô hình AI: 

- **Tiếp nhận dữ liệu:** Nhận các trường thông tin game_id, level, message. 

- **Kiểm tra hợp lệ:** Sử dụng Pydantic schema để lọc bỏ các dữ liệu rác hoặc sai định dạng. 

- **Chuẩn bị tri thức:** Hệ thống tự động truy xuất bộ luật/kiến thức nền (Rule-base) tương ứng với game_id. Việc tách biệt logic chuẩn bị dữ liệu tại Backend giúp hệ thống dễ dàng cập nhật luật chơi mà không cần sửa đổi mã nguồn Frontend hay can thiệp vào mô hình AI. 

## **3.  Xây dựng Prompt và nạp ngữ cảnh** 

Để biến mô hình ngôn ngữ lớn (LLM) thành một trợ lý an toàn cho trẻ em, hệ thống áp dụng kỹ thuật Prompt Engineering chặt chẽ thay vì gửi trực tiếp câu hỏi thô. Quy trình xây dựng Prompt bao gồm: 

- **Trích xuất luật:** Chọn tập **GAME_RULES** (chứa luật chơi, cách tính điểm, mẹo vặt) phù hợp với ngữ cảnh game_id. 

- **Ghép Prompt:** Tạo một chỉ thị tổng hợp theo cấu trúc: **[Luật chơi] + [Câu hỏi người dùng] + [Ràng buộc hệ thống].** 

- **Ràng buộc đầu ra:** Prompt được cấu hình nghiêm ngặt để yêu cầu AI trả lời bằng tiếng Việt, giới hạn độ dài (1-3 câu), văn phong thân thiện, và đặc biệt không sử dụng Markdown. Việc loại bỏ Markdown giúp hiển thị văn bản thuần túy, tránh gây rối mắt cho trẻ. Đồng thời, ràng buộc về nội dung giúp ngăn chặn AI trả lời lan man hoặc đưa ra các thông tin kỹ thuật phức tạp không phù hợp lứa tuổi. 

## **4. Tích hợp dịch vụ Generative AI (Gemini API)** 

Hệ thống sử dụng **SDK google-generativeai** để kết nối với mô hình ngôn ngữ, cụ thể là phiên bản **gemini-flash-latest** . 

- **Lý do chọn mô hình:** Phiên bản flash được lựa chọn nhờ ưu thế vượt trội về tốc độ phản hồi (low latency) và chi phí thấp, phù hợp cho các tác vụ tương tác thời gian thực liên tục. 

_66_ 

- **Cơ chế xử lý:** Mô hình phân tích ngữ cảnh từ luật chơi kết hợp với câu hỏi để sinh ra hướng dẫn cụ thể. 

- **Bảo mật:** Khóa **GEMINI_API_KEY** được quản lý tuyệt đối ở phía Server (thông qua biến môi trường). Điều này ngăn chặn hoàn toàn nguy cơ lộ khóa API nếu bị soi mã nguồn tại trình duyệt, đảm bảo an toàn tài nguyên hệ thống. 

## **5. Phản hồi kết quả về Client** 

Backend xử lý kết quả từ Gemini, trích xuất nội dung văn bản thuần và gửi trả về Client theo định dạng chuẩn JSON (reply). Giao diện Chatbot hiển thị câu trả lời ngay lập tức trên cùng một màn hình. Việc giữ nguyên ngữ cảnh màn hình (không tải lại trang, không chuyển tab) giúp duy trì sự tập trung của trẻ, tránh gây xao nhãng, một yếu tố cực kỳ quan trọng trong thiết kế trải nghiệm cho trẻ ASD. 

## **6. Cơ chế dự phòng và xử lý lỗi thân thiện** 

Hệ thống ưu tiên sự ổn định tâm lý cho trẻ, do đó luồng xử lý lỗi được thiết kế theo nguyên tắc Silent Fail-safe (Thất bại im lặng): 

- **Nguyên tắc:** Nếu việc gọi AI thất bại (do mạng, lỗi dịch vụ Gemini, hoặc chưa cấu hình API Key), hệ thống tuyệt đối không hiển thị các thông báo lỗi kỹ thuật gây hoang mang (như "Error 500" hay "Connection Failed"). 

- **Cơ chế thay thế:** Hệ thống tự động kích hoạt hàm build_fallback_reply() để trả về một nội dung an toàn được định nghĩa trước (ví dụ: tóm tắt luật chơi cơ bản hoặc lời khuyên chung như "Con hãy quan sát kỹ hướng dẫn trên màn hình nhé"). Cơ chế này đảm bảo luồng tương tác của trẻ luôn liền mạch, không bị đứt gãy bởi các sự cố kỹ thuật phía sau hậu trường. 

## **7. Tăng cường hỗ trợ bằng giọng nói (TTS)** 

Để hỗ trợ nhóm trẻ chưa thành thạo kỹ năng đọc, widget Chatbot tích hợp tính năng chuyển văn bản thành giọng nói (Text-to-Speech) với chiến lược dự phòng đa lớp: 

- **Lớp chính:** Sử dụng **speechSynthesis** (API có sẵn của trình duyệt) để đọc ngay lập tức. Đây là giải pháp có độ trễ bằng 0 và không tốn băng thông. 

- **Lớp phụ:** Nếu trình duyệt không hỗ trợ giọng tiếng Việt, hệ thống tự động chuyển sang gọi API **FPT.AI** (giọng banmai) để lấy file âm thanh. Chiến lược này đảm bảo mọi trẻ em, bất kể sử dụng thiết bị hay trình duyệt nào, đều nhận được phản hồi đa 

_67_ 

phương thức (nhìn văn bản kết hợp nghe âm thanh), tăng cường hiệu quả tiếp nhận thông tin. 

## **2. Thiết kế trải nghiệm người dùng** 

Việc thiết kế trải nghiệm cho trẻ rối loạn phổ tự kỷ đòi hỏi sự tuân thủ nghiêm ngặt các nguyên tắc về tính tiếp cận và tâm lý học nhận thức. Hệ thống không chỉ cần đẹp về mặt thẩm mỹ mà phải đóng vai trò như một môi trường giảm nhiễu, giúp trẻ tập trung tối đa năng lượng não bộ vào nhiệm vụ xử lý cảm xúc thay vì bị phân tâm bởi các yếu tố giao diện phức tạp. 

## **2.1 Chiến lược thị giác và giảm tải nhận thức** 

Dựa trên đặc điểm liên kết trung tâm yếu của trẻ ASD, giao diện được xây dựng theo chiến lược tối giản hóa và nổi bật thị giác. Toàn bộ không gian màn hình được quy hoạch thành ba vùng chức năng cố định, loại bỏ hoàn toàn các họa tiết trang trí thừa vốn thường thấy trong các ứng dụng cho trẻ em thông thường. Phông nền sử dụng các gam màu trung tính để giảm cường độ ánh sáng, ngăn chặn tình trạng quá tải giác quan. 

Trong các bài tập biểu hiện cảm xúc, hệ thống áp dụng kỹ thuật neo chú ý. Một khung bao ảo được hiển thị nhẹ nhàng quanh khuôn mặt trẻ trên màn hình, đóng vai trò như một gợi ý thị giác giúp trẻ biết chính xác cần nhìn vào đâu. Khi trẻ cần tập trung vào một đặc điểm cụ thể (ví dụ: miệng cười), các vùng khác của khuôn mặt hoặc nền phía sau có thể được làm mờ cục bộ hoặc giảm độ tương phản. Cách bố trí này giúp lọc bỏ các thông tin nhiễu, hướng dòng chảy thị giác của trẻ vào đúng tín hiệu cảm xúc cần xử lý, từ đó giảm tải gánh nặng nhận thức cho não bộ. 

## **2.2 Thiết kế tương tác tự nhiên (NUI)** 

Hệ thống loại bỏ hoàn toàn mô hình tương tác gián tiếp qua chuột và bàn phím trong các bài tập biểu đạt, chuyển sang mô hình Tương tác tự nhiên (NUI). Trong mô hình này, khuôn mặt và cơ thể trẻ trở thành phương tiện điều khiển duy nhất. Quyết định thiết kế này dựa trên thực tế rằng việc phối hợp tay-mắt để điều khiển con trỏ chuột là một tác vụ phức tạp, có thể gây xao nhãng khỏi mục tiêu chính là học cảm xúc. 

Bằng cách biến camera thành cảm biến đầu vào, trẻ được trải nghiệm cảm giác Soi gương kỹ thuật số. Khi trẻ cười, hình ảnh phản chiếu trên màn hình cũng cười; khi trẻ nghiêng đầu, hình ảnh cũng nghiêng theo. Sự đồng bộ vật lý này tạo ra tính nhập vai (immersion) cao, xóa bỏ rào cản giữa người và máy. Các nút bấm điều hướng (như Tiếp tục, Thoát) vẫn được 

_68_ 

giữ lại nhưng được thiết kế tuân thủ định luật Fitts: kích thước lớn, khoảng cách xa nhau và đặt ở các vị trí góc màn hình để tránh việc trẻ bấm nhầm khi đang thực hiện động tác cơ thể. 

## **2.3 Cơ chế phản hồi và kiến trúc vòng lặp khép kín** 

Trái tim của trải nghiệm người dùng trong hệ thống là vòng lặp tương tác khép kín, vận hành theo chu trình: Hành động  → Phản hồi tức thì  → Điều chỉnh. 

- **Hành động:** Trẻ thực hiện một biểu cảm khuôn mặt. 

- **Phản hồi:** Hệ thống AI phân tích và trả về tín hiệu thị giác (như hiệu ứng pháo hoa, viền xanh) trong thời gian thực (< 300ms). Tốc độ này là yếu tố HCI then chốt để não bộ trẻ thiết lập mối liên kết nhân quả giữa hành vi và phần thưởng. 

- **Điều chỉnh:** Dựa trên phản hồi, trẻ tự điều chỉnh cơ mặt để đạt kết quả tốt hơn. 

Đặc biệt, hệ thống áp dụng nguyên tắc thiết kế khoan dung. Đối với trẻ tự kỷ, các tín hiệu báo lỗi tiêu cực (như âm thanh Buzz sai, màu đỏ chói) có thể gây lo âu và khiến trẻ thu mình lại. Do đó, hệ thống không bao giờ hiển thị trạng thái Thất bại (Game Over). Khi trẻ làm chưa đúng, hệ thống chỉ giữ trạng thái trung tính hoặc đưa ra các gợi ý dẫn dắt như hình ảnh minh họa mẫu, khuyến khích trẻ thử lại trong một tâm thế an toàn và không áp lực. 

## **3. Thiết kế biểu đồ tuần tự** 

_69_ 

## **3.1 Luồng xử lý học và ôn tập cảm xúc** 

Hình 4.1. Sơ đồ tuần tự cho ca sử dụng học và ôn tập cảm xúc 

_70_ 

## **3.2 Luồng xử lý luyện tập biểu hiện cảm xúc** 

Hình 4.2. Sơ đồ tuần tự cho ca sử dụng luyện tập biểu hiện cảm xúc 

_71_ 

## **3.3 Luồng xử lý chơi game nhận diện cảm xúc** 

Hình 4.3 Sơ đồ tuần tự cho ca sử dụng chơi game nhận diện cảm xúc 

_72_ 

## **3.4 Luồng xử lý tạo báo cáo** 

Hình 4.4. Sơ đồ tuần tự cho ca sử dụng tạo báo cáo 

_73_ 

## **3.5 Luồng xử lý sử dụng Chatbot** 

Hình 4.5. Sơ đồ tuần tự cho ca sử dụng sử dụng Chatbot 

## **4. Thiết kế cơ sở dữ liệu** 

Cơ sở dữ liệu của hệ thống Emo Garden được thiết kế theo mô hình quan hệ, hướng tới việc quản lý hiệu quả dữ liệu người dùng, nội dung đa phương tiện và dữ liệu hành vi trong quá trình tương tác thời gian thực. Các bảng dữ liệu được liên kết thông qua khóa chính và khóa ngoại, hình thành một cấu trúc nhất quán, hỗ trợ truy xuất nhanh, theo dõi tiến trình học tập và sinh báo cáo tự động. Thiết kế này đáp ứng đồng thời các yêu cầu về xác thực người dùng, tổ chức nội dung trò chơi, ghi nhận quá trình tương tác và đánh giá tiến bộ học tập của trẻ. Sau đây là khái quát về các bảng được sử dụng làm cơ sở dữ liệu của hệ thống: 

_74_ 

Bảng 4.1. Danh sách và vai trò các bảng trong cơ sở dữ liệu 

||||
|---|---|---|
|**Tên bảng**|**Vai trò**|**Mô tả nội dung và chức năng**|
||||
|**Users**|Nền tảng quản lý<br>danh tính và kiểm<br>soát truy cập|Lưu trữ thông tin tài khoản (username, email,<br>password) và phân loại vai trò (trẻ em hoặc quản<br>trị viên). Được sử dụng chung cho cả quản trị viên<br>và người dùng cuối.|
|**Children**|Hồ sơ mở rộng<br>dành riêng cho trẻ<br>em|Lưu trữ các thông tin nhân khẩu học và thiết lập<br>cá nhân hóa như tuổi, giới tính, ngày sinh, số điện<br>thoại và cấu hình báo cáo định kỳ. Có quan hệ 1:1<br>với bảng Users thông qua user_id.|
|**Games**|Định nghĩa danh<br>mục trò chơi|Lưu trữ các tham số cấu hình cốt lõi như loại trò<br>chơi (GameClick hoặc Game CV), tên, cấp độ tối<br>đa, độ khó, số lỗi cho phép tối đa và giới hạn thời<br>gian.|
|**Game**<br>**Content,**<br>**Questions**|Quản lý nội dung<br>chi tiết của màn<br>chơi|Lưu trữ dữ liệu đa phương tiện, nội dung câu hỏi,<br>đáp án đúng và cảm xúc tương ứng. Cho phép<br>quản trị viên cập nhật hoặc mở rộng nội dung bài<br>học.|
|**Emotion**<br>**Concepts**|Thư viện kiến thức<br>về cảm xúc|Lưu trữ các tài liệu minh họa như video, hình ảnh,<br>âm thanh và mô tả ngắn gọn cho từng loại cảm<br>xúc. Dữ liệu được sử dụng trong chức năng “Học”<br>và “Góc học tập”.|
|**Sessions**|Ghi nhận thông tin<br>tổng<br>quan<br>của<br>phiên chơi|Ghi nhận thời gian bắt đầu, kết thúc, điểm số,<br>trạng thái hoàn thành và các lỗi cảm xúc được<br>thống kê. Giúp theo dõi lịch sử sử dụng và hành<br>vi tương tác của trẻ.|



_75_ 

||||
|---|---|---|
|**Tên bảng**|**Vai trò**|**Mô tả nội dung và chức năng**|
||||
|**Session**<br>**Questions**|Dữ liệu chi tiết cho<br>từng câu hỏi trong<br>phiên chơi|Lưu trữ đáp án của trẻ, kết quả đúng sai, thời gian<br>phản hồi và việc sử dụng gợi ý. Quan trọng để<br>phân tích hành vi học tập.|
|**Child**<br>**Progress**|Bảng tổng hợp tiến<br>độ học tập dài hạn|Phản ánh tiến độ học tập dài hạn của trẻ theo từng<br>trò chơi và cấp độ. Cập nhật các chỉ số như độ<br>chính xác, điểm số và danh sách cảm xúc cần ôn<br>tập.|
|**Reports**|Lưu trữ báo cáo<br>định kỳ|Lưu trữ các báo cáo được hệ thống tự động sinh<br>ra dựa trên dữ liệu từ Sessions và Child Progress.<br>Cung cấp thông tin tổng hợp và phân tích cho phụ<br>huynh/giáo viên.|



Dựa trên thiết kế trên, sau đây là chi tiết về các bảng và mối quan hệ giữa chúng trong cơ sở dữ liệu dự án. 

_76_ 

Hình 4.6. Cơ sở dữ liệu của dự án 

## **5. Thiết kế API** 

Hệ thống Emo Garden được xây dựng dựa trên kiến trúc **RESTful API** , sử dụng framework **FastAPI** (Python) cho phía Backend. Các API đóng vai trò là cầu nối giao tiếp dữ liệu giữa Client (giao diện người dùng) và Server (cơ sở dữ liệu và các mô hình AI). Mọi dữ liệu trao đổi đều tuân thủ định dạng JSON tiêu chuẩn. 

Để đảm bảo tính bảo mật và dễ quản lý, hệ thống phân chia 54 endpoints thành các nhóm chức năng riêng biệt. Dưới đây là danh sách chi tiết các API được thiết kế và triển khai: 

_77_ 

## **5.1 Nhóm API Quản lý người dùng** 

Nhóm API này chịu trách nhiệm xử lý các tác vụ liên quan đến xác thực (Authentication) và quản lý thông tin tài khoản. 

Bảng 4.2. Danh sách API Quản lý người dùng 

|||||
|---|---|---|---|
|**STT**|**Method**|**Endpoint (URL)**|**Mô tả chức năng**|
|1|POST|/users/register|Đăng ký tài khoản mới cho trẻ em.|
|2|POST|/users/login|Đăng nhập hệ thống, trả về Access Token.|
|3|POST|/users/verify-otp|Xác thực mã OTP gửi qua email để kích hoạt<br>tài khoản.|
|4|POST|/users/logout|Đăng xuất, vô hiệu hóa phiên làm việc hiện tại.|
|5|POST|/users/forgot-password|Gửi yêu cầu lấy lại mật khẩu (gửi OTP qua<br>email).|
|6|POST|/users/reset-password|Thiết lập mật khẩu mới sau khi xác thực thành<br>công.|
|7|GET|/users/me|Lấy thông tin hồ sơ (profile) của người dùng<br>hiện tại.|
|8|PUT|/users/me|Cập nhật thông tin cá nhân người dùng.|



_78_ 

## **5.2 Nhóm API trò chơi và tiến độ** 

Các API này cung cấp dữ liệu cho các màn chơi, quản lý phiên chơi (session) và lưu trữ tiến độ học tập của trẻ. 

Bảng 4.3. Danh sách API Trò chơi 

|||||
|---|---|---|---|
|**STT**|**Method**|**Endpoint (URL)**|**Mô tả chức năng**|
|9|GET|/games|Lấy danh sách toàn bộ các trò chơi có<br>trong hệ thống.|
|10|GET|/games/{game_id}|Lấy thông tin chi tiết và cấu hình của một<br>game cụ thể.|
|11|GET|/games/progress/{game_id}|Truy xuất dữ liệu tiến độ chơi game của<br>người dùng.|
|12|POST|/games/start/{game_id}|Khởi tạo một phiên chơi mới (session<br>start).|
|13|POST|/games/end-level|Kết thúc màn chơi, lưu kết quả và cập nhật<br>điểm số.|



_79_ 

## **5.3 Nhóm API game tương tác AI và Computer Vision** 

Đây là nhóm API nòng cốt xử lý các tương tác thời gian thực, bao gồm nhận diện cảm xúc và phản hồi âm thanh. 

Bảng 4.4. Danh sách API Game CV 

|||||
|---|---|---|---|
|**STT**|**Method**|**Endpoint (URL)**|**Mô tả chức năng**|
|14|GET|/games/cv/scenarios|Lấy danh sách kịch bản/tình huống (10 level)<br>cho game CV.|
|15|GET|/games/cv/requests|Lấy danh sách các yêu cầu biểu cảm khuôn<br>mặt cần thực hiện.|
|16|POST|/games/cv/start|Khởi tạo phiên làm việc cho game nhận diện<br>cảm xúc.|
|17|POST|/games/cv/result|Gửi và lưu trữ kết quả nhận diện của từng<br>màn chơi.|
|18|POST|/games/cv/end|Kết thúc phiên game CV, tổng kết điểm số.|
|19|GET|/games/cv/emotion-scores|Lấy điểm số cao nhất đạt được cho từng loại<br>cảm xúc.|
|20|GET|/games/cv/completed-levels|Truy xuất danh sách các level người dùng đã<br>hoàn thành.|
|21|GET|/games/cv/audio-proxy|Proxy trung gian tải âm thanh từ FPT.AI (xử<br>lý vấn đề CORS).|



_80_ 

## **5.4 Nhóm API nội dung học tập và trợ lý ảo** 

Bảng 4.5. Danh sách API nội dung và trợ lý ảo 

|||||
|---|---|---|---|
|**STT**|**Method**|**Endpoint (URL)**|**Mô tả chức năng**|
|22|GET|/emotions/concepts|Lấy danh sách thẻ học cảm xúc (bao gồm video,<br>ảnh, mô tả).|
|23|POST|/assistant/chat|Gửi câu hỏi và nhận phản hồi từ chatbot (tích<br>hợp Gemini AI).|



## **5.5 Nhóm API báo cáo và thống kê** 

Bảng 4.6. Danh sách API báo cáo 

|||||
|---|---|---|---|
|**STT**|**Method**|**Endpoint (URL)**|**Mô tả chức năng**|
|24|GET|/reports/statistics|Lấy số liệu thống kê tổng quan (theo<br>tuần/tháng).|
|25|POST|/reports/generate-and-send|Tạo file báo cáo PDF và gửi email<br>cho một người dùng cụ thể.|
|26|POST|/reports/send-batch|Gửi báo cáo hàng loạt cho danh sách<br>người dùng.|
|27|POST|/reports/request-report|Người dùng chủ động yêu cầu hệ<br>thống gửi báo cáo cho bản thân.|
|28|GET|/reports/history|Xem lịch sử các báo cáo đã được tạo<br>của người dùng.|



_81_ 

|||||
|---|---|---|---|
|**STT**|**Method**|**Endpoint (URL)**|**Mô tả chức năng**|
|29|GET|/reports/{report_id}|Xem chi tiết nội dung của một báo<br>cáo cụ thể.|
|30|GET|/reports/preview/{child_user_id}|Xem trước dữ liệu báo cáo (chế độ<br>Preview, không lưu DB).|
|31|GET|/reports/all|Lấy danh sách toàn bộ báo cáo (dành<br>cho Admin).|
|32|POST|/reports/test-email|Kiểm tra cấu hình và kết nối của dịch<br>vụ gửi email (SMTP).|



## **5.6 Nhóm API quản trị hệ thống** 

Nhóm API này dành riêng cho quyền Admin để quản lý toàn bộ tài nguyên, người dùng và nội dung hệ thống. 

Bảng 4.7. Danh sách API quản trị 

|||||
|---|---|---|---|
|**STT**|**Method**|**Endpoint (URL)**|**Mô tả chức năng**|
|33|GET|/admin/users|Lấy danh sách toàn bộ người<br>dùng trong hệ thống.|
|34|GET|/admin/users/search|Tìm kiếm người dùng theo tên<br>hoặc email.|
|35|POST|/admin/users|Tạo mới tài khoản người dùng<br>(cấp quyền Admin hoặc User).|
|36|GET|/admin/users/{user_id}|Xem thông tin chi tiết một người<br>dùng bất kỳ.|



_82_ 

|||||
|---|---|---|---|
|**STT**|**Method**|**Endpoint (URL)**|**Mô tả chức năng**|
|33|GET|/admin/users|Lấy danh sách toàn bộ người<br>dùng trong hệ thống.|
|37|PUT|/admin/users/{user_id}|Cập nhật thông tin người dùng từ<br>phía Admin.|
|38|DELETE|/admin/users/{user_id}|Xóa tài khoản người dùng khỏi<br>hệ thống.|
|39|GET|/admin/children|Lọc và lấy danh sách riêng các tài<br>khoản trẻ em.|
|40|GET|/admin/game-contents|Quản lý danh sách nội dung các<br>trò chơi.|
|41|GET|/admin/game-contents/{id}|Xem chi tiết cấu hình nội dung<br>game.|
|42|POST|/admin/game-contents|Thêm mới nội dung trò chơi.|
|43|PUT|/admin/game-contents/{id}|Chỉnh sửa nội dung trò chơi hiện<br>có.|
|44|DELETE|/admin/game-contents/{id}|Xóa một nội dung trò chơi.|
|45|POST|/admin/game-contents/bulk-<br>delete|Xóa hàng loạt nội dung game<br>được chọn.|
|46|POST|/admin/game-<br>contents/upload|Tải lên các file đa phương tiện<br>(ảnh/video/audio) cho game.|
|47|POST|/admin/emotions/upload-<br>video|Tải lên video mẫu cho bài học<br>cảm xúc.|



_83_ 

|||||
|---|---|---|---|
|**STT**|**Method**|**Endpoint (URL)**|**Mô tả chức năng**|
|33|GET|/admin/users|Lấy danh sách toàn bộ người<br>dùng trong hệ thống.|
|48|GET|/admin/emotions/videos|Quản lý danh sách video cảm xúc<br>hiện có.|
|49|GET|/admin/emotion-concepts|Quản lý các khái niệm/định nghĩa<br>về cảm xúc.|
|50|POST|/admin/emotion-<br>concepts/upload|Tải lên video minh họa cho khái<br>niệm cảm xúc.|
|51|POST|/admin/emotion-<br>concepts/delete|Xóa video minh họa của khái<br>niệm cảm xúc.|
|52|GET|/admin/reports/statistics|Xem thống kê báo cáo toàn hệ<br>thống.|
|53|GET|/admin/reports/{report_id}|Xem chi tiết bất kỳ báo cáo nào<br>trong hệ thống.|
|54|POST|/admin/reports/{id}/resend|Thực hiện gửi lại một báo cáo đã<br>tạo trước đó.|



_84_ 

## **CHƯƠNG 5: CÀI ĐẶT VÀ KIỂM THỬ HỆ THỐNG** 

## **1. Môi trường cài đặt và triển khai** 

Hệ thống Emo Garden được xây dựng dựa trên kiến trúc Client-Server hiện đại, đảm bảo sự tách biệt rõ ràng giữa giao diện người dùng (Frontend) và logic xử lý nghiệp vụ (Backend). Hai thành phần này giao tiếp với nhau thông qua chuẩn RESTful API. Môi trường triển khai hiện tại được tối ưu hóa cho hệ điều hành Windows, phục vụ quá trình phát triển và kiểm thử. 

## **1.1 Môi trường phía Server** 

Phân hệ Backend đóng vai trò là bộ não của hệ thống, xử lý logic nghiệp vụ, trí tuệ nhân tạo và quản lý dữ liệu. Môi trường Backend được xây dựng trên nền tảng ngôn ngữ **Python** với các thành phần kỹ thuật chính sau: 

- **Framework và Web Server:** Sử dụng **FastAPI (v0.120.0)** , framework web hiện đại hỗ trợ lập trình bất đồng bộ, giúp tối ưu hóa hiệu năng xử lý request và tích hợp sẵn validation dữ liệu qua **Pydantic** . Ứng dụng được vận hành bởi **Uvicorn (v0.38.0)** , một ASGI server hiệu suất cao lắng nghe tại cổng 8000. 

- **Quản trị Cơ sở dữ liệu (ORM):** Sử dụng **SQLAlchemy (v2.0.44)** làm công cụ ánh xạ đối tượng - quan hệ, giúp tương tác với cơ sở dữ liệu an toàn và hiệu quả thông qua code Python. Việc quản lý phiên bản và thay đổi cấu trúc dữ liệu (Database Migration) được kiểm soát chặt chẽ bởi **Alembic (v1.17.0)** . 

- **Xử lý AI và đa phương tiện:** 

   - **Google Generative AI:** Tích hợp để xây dựng Chatbot và các tính năng tương tác thông minh. 

   - **Pillow (v10.1.0):** Hỗ trợ các tác vụ xử lý hình ảnh đầu vào. 

   - **ReportLab (v4.0.7):** Thư viện chuyên dụng để sinh báo cáo kết quả học tập dưới định dạng PDF. 

- **Môi trường phát triển:** Toàn bộ thư viện phụ thuộc được cô lập trong môi trường ảo **Python Virtual Environment (.venv)** , đảm bảo tính nhất quán khi triển khai trên các máy trạm khác nhau. 

_85_ 

## **1.2 Môi trường phía Client** 

Phân hệ Frontend đảm nhận việc hiển thị giao diện và tương tác trực tiếp với người dùng (trẻ em, phụ huynh, admin). Môi trường này được xây dựng dựa trên hệ sinh thái **JavaScript** với các công cụ: 

- **Runtime Environment:** Yêu cầu **Node.js (v20.19.0 trở lên)** , được quản lý phiên bản thông qua **NVM (Node Version Manager)** để đảm bảo tính tương thích cao nhất. 

- **Build Tool:** Sử dụng **Vite (v7.2.2)** kết hợp với **Rollup (v4.52.5)** . Vite cung cấp khả năng thay thế module nóng (HMR - Hot Module Replacement) cực nhanh, giúp tăng tốc độ phát triển và đóng gói ứng dụng tối ưu. Server phát triển chạy tại cổng 5173, được cấu hình Proxy để chuyển tiếp các yêu cầu API đến Backend. 

- **Thư viện cốt lõi:** 

   - **Face-API.js:** Thư viện Machine Learning chạy trực tiếp trên trình duyệt, cho phép nhận diện khuôn mặt và cảm xúc thời gian thực qua Webcam mà không cần gửi video về server, giảm độ trễ tối đa. 

   - **Axios:** Quản lý các kết nối HTTP đến Backend. 

   - **Socket.io:** Hỗ trợ các tính năng giao tiếp thời gian thực (Real-time communication). 

## **1.3 Hệ quản trị cơ sở dữ liệu** 

Hệ thống sử dụng **Microsoft SQL Server** làm hệ quản trị cơ sở dữ liệu quan hệ (RDBMS), đảm bảo tính toàn vẹn và khả năng truy vấn phức tạp. 

- **Kết nối:** Ứng dụng kết nối với Database thông qua **ODBC Driver 17 for SQL Server** . 

- **Cấu trúc dữ liệu:** Cơ sở dữ liệu có tên **"TTNM"** , bao gồm các bảng nghiệp vụ trọng yếu như: users, children (thông tin người dùng), games, game_content (dữ liệu trò chơi), sessions (lịch sử chơi), emotion_concepts (bài học) và reports (báo cáo thống kê). 

## **1.4 Quản lý cấu hình và bảo mật** 

Tuân thủ nguyên tắc **12-Factor App** , toàn bộ thông tin cấu hình và dữ liệu nhạy cảm được tách biệt khỏi mã nguồn và quản lý tập trung trong file **.env** tại thư mục backend. Các thông số bao gồm: 

- Chuỗi kết nối cơ sở dữ liệu (Connection String). 

_86_ 

- Thông tin xác thực SMTP (gửi email báo cáo). 

- Khóa API (Google AI API Key) và các biến môi trường khác. Việc này giúp quy trình chuyển đổi giữa các môi trường (Development, Staging, Production) diễn ra linh hoạt và an toàn. 

## **1.5 Quy trình khởi chạy tự động** 

Để đơn giản hóa việc triển khai môi trường phát triển trên Windows, hệ thống cung cấp script tự động hóa **run_prj.bat** . Khi được thực thi, script này thực hiện chuỗi tác vụ: 

1. Kích hoạt môi trường ảo Python và cài đặt các thư viện cần thiết qua pip. 

2. Khởi động server Backend (FastAPI) ở chế độ hot-reload. 

3. Cài đặt các gói node_modules cho Frontend (nếu chưa có). 

4. Khởi động development server của Vite. 

Cả hai server (Backend và Frontend) sẽ chạy song song trên các cửa sổ terminal riêng biệt, tạo nên một môi trường phát triển đồng bộ và sẵn sàng sử dụng. 

## **2. Kết quả cài đặt giao diện** 

## **2.1 Màn hình các game “luyện tập biểu hiện cảm xúc”** 

Đây là thành phần cốt lõi của hệ thống, nơi cung cấp trải nghiệm tương tác thông qua camera nhằm hỗ trợ trẻ luyện tập biểu đạt cảm xúc theo cơ chế nhìn, bắt chước, điều chỉnh trong thời gian thực. Luồng hoạt động chính của màn hình bao gồm: cho phép truy cập camera → hiển thị khung hình → hiển thị yêu cầu hoặc tình huống → theo dõi mức độ khớp biểu cảm (tính theo %) → phản hồi đạt hoặc chưa đạt. 

_87_ 

## **2.1.1 Giao diện luyện tập biểu hiện cảm xúc** 

**Hình 5.1.** Giao diện tổng quan Game CV 

**Hình 5.2** Giao diện trạng thái đang nhận diện biểu cảm (hiển thị biểu tượng cảm xúc và phần trăm khớp). 

_88_ 

## **2.1.2 Các thành phần trải nghiệm người dùng chính** 

Giao diện Game CV được thiết kế dựa trên mô hình **"Gương thông minh"** , chia màn hình thành hai khu vực chức năng rõ rệt nhằm tối ưu hóa sự tập trung của trẻ: 

## ● **Khung Camera "Gương phản chiếu":** 

- Đây là vùng tương tác chính, hiển thị hình ảnh thời gian thực từ webcam thông qua API getUserMedia. 

- Hình ảnh được xử lý lật ngang để tạo cảm giác tự nhiên như soi gương, giúp trẻ dễ dàng điều chỉnh cơ mặt theo nguyên lý **"Video Modeling"** (Học qua quan sát mô hình). 

- Kích thước khung hình được cố định, bo góc mềm mại để tạo cảm giác an toàn và ổn định thị giác. 

## ● **Khối kích thích và yêu cầu:** 

Nằm bên trái màn hình, khu vực này hiển thị các tác nhân kích thích cảm xúc dưới hai 

dạng: 

- **Chế độ tình huống:** Hiển thị hình ảnh văn bản tình huống kèm phát âm mô tả một bối cảnh xã hội (ví dụ: nhận quà, làm vỡ đồ chơi) để trẻ suy luận và biểu đạt cảm xúc tương ứng. 

- **Chế độ mệnh lệnh:** Hiển thị trực tiếp tên cảm xúc kèm hình ảnh minh họa để trẻ bắt chước. 

## ● **Hệ thống chỉ báo phản hồi:** 

- **Thanh tín hiệu "Đèn giao thông":** Thay vì dùng các con số khô khan, hệ thống sử dụng ẩn dụ đèn giao thông để báo hiệu trạng thái nhận diện: 

   - 🔴 **Đỏ:** Chưa phát hiện khuôn mặt hoặc sai cảm xúc. 

   - 🔴 **Vàng:** Biểu cảm gần đúng (Gợi ý trẻ cần cố gắng thêm). 

   - 🔴 **Xanh:** Chính xác (Kích hoạt hiệu ứng chúc mừng). 

- **Độ tin cậy AI:** Hiển thị mức độ khớp của biểu cảm dưới dạng phần trăm (%), giúp trẻ định lượng được mức độ biểu đạt của mình. 

## ● **Cơ chế hỗ trợ "Scaffolding":** 

_89_ 

- Nút **"Gợi ý" (Hint):** Cung cấp mô tả văn bản hoặc hình ảnh mẫu khi trẻ gặp bế tắc. 

- Nút **"Nghe" (Text-to-Speech):** Hỗ trợ trẻ gặp khó khăn về đọc hiểu văn bản bằng cách phát âm thanh yêu cầu. 

## **2.1.3 Nguyên tắc thiết kế trải nghiệm cho trẻ ASD** 

Dựa trên các đặc điểm tâm lý và nhận thức của trẻ ASD, giao diện được xây dựng tuân thủ nghiêm ngặt các nguyên tắc HCI sau: 

## 1. **Giảm tải nhận thức và nhiễu thị giác:** 

- Sử dụng **khoảng trắng** rộng rãi, loại bỏ hoàn toàn các chi tiết trang trí thừa, quảng cáo hoặc các chuyển động nền có thể gây mất tập trung. 

- Bố cục chia đôi màn hình giúp trẻ không phải đảo mắt quá nhiều giữa đề bài và hình ảnh phản chiếu. 

## 2. **Màu sắc và Typography trị liệu:** 

- Sử dụng bảng màu **Pastel Blue (#e3f2fd, #bbdefb)** làm chủ đạo. Theo tâm lý học màu sắc, tông xanh dương mang lại cảm giác bình tĩnh (calming), giảm căng thẳng và lo âu cho trẻ nhạy cảm giác quan. 

- Sử dụng phông chữ **Nunito** (Sans-serif, bo tròn) với kích thước lớn, độ đậm vừa phải (Font-weight 600-700) để tăng khả năng đọc hiểu và tạo cảm giác thân thiện. 

## 3. **Tính nhất quán và dự đoán được:** 

- Vị trí các nút bấm (Quay lại, Gợi ý, Bắt đầu) được cố định ở mọi màn chơi, giúp trẻ nhanh chóng hình thành thói quen sử dụng mà không cần học lại thao tác. 

- Hệ thống luôn phản hồi rõ ràng trạng thái hệ thống thông qua các tín hiệu đèn màu và âm thanh nhẹ nhàng. 

## 4. **Phản hồi tích cực và tránh quá tải giác quan:** 

- Khi trẻ làm đúng, hệ thống sử dụng các hiệu ứng chúc mừng (Confetti, âm thanh vui nhộn) nhưng ở mức độ vừa phải, tránh các âm thanh quá lớn hoặc hình ảnh nhấp nháy mạnh có thể gây kích động cho trẻ nhạy cảm. 

_90_ 

- Khi trẻ làm sai, hệ thống sử dụng ngôn ngữ khích lệ ("Cố lên nhé") thay vì phủ định ("Sai rồi"), kết hợp với cơ chế **"Góc học tập"** (Adaptive Learning) để chuyển hướng sang video hướng dẫn thay vì trừng phạt. 

## **2.2 Màn hình “trò chơi nhận diện cảm xúc”** 

Nhóm mini-game dạng trắc nghiệm hoặc click được thiết kế nhằm luyện khả năng nhận diện cảm xúc thông qua việc đọc tình huống hoặc quan sát hình ảnh, sau đó lựa chọn đáp án phù hợp và nhận phản hồi ngay lập tức. Nhóm trò chơi này phù hợp cho các giai đoạn làm quen khái niệm cảm xúc ở mức độ dễ, cũng như củng cố khả năng phân biệt cảm xúc trong ngữ cảnh ở mức trung bình và khó hơn. 

## **2.2.1 Giao diện trò chơi nhận diện cảm xúc** 

**Hình 5.3** Giao diện game Chiếc hộp cảm xúc 

_91_ 

**Hình 5.4** Giao diện game Xưởng cảm xúc 

**Hình 5.5** Giao diện game Cảm xúc đúng chỗ 

**Hình 5.6** Giao diện game Thám tử cảm xúc 

## **2.2.2 Thiết kế nút bấm và minh họa** 

Giao diện trò chơi nhận diện được xây dựng dựa trên nguyên lý **"tối giản và nhất quán"** , tập trung vào việc giúp trẻ dễ dàng thao tác và hiểu luật chơi mà không cần nhiều hướng dẫn. 

- **Thiết kế nút bấm "Chạm - Thân thiện":** 

   - **Kích thước và Định luật Fitts:** Các nút đáp án được thiết kế với kích thước lớn (chiều cao tối thiểu 90px), tuân thủ định luật Fitts nhằm tối ưu hóa thời 

_92_ 

gian và độ chính xác khi thao tác, đặc biệt hỗ trợ trẻ có kỹ năng vận động tinh (fine motor skills) chưa hoàn thiện. 

- **Mã hóa kép:** Mỗi nút bấm không chỉ chứa văn bản (tên cảm xúc) mà còn kèm theo biểu tượng cảm xúc (Emoji) tương ứng. Cách tiếp cận này hỗ trợ cả trẻ biết đọc và trẻ chỉ tư duy qua hình ảnh, tăng khả năng ghi nhớ thông tin. 

- **Vị trí nhất quán:** Vị trí của 6 nhóm cảm xúc cơ bản được giữ cố định hoặc sắp xếp theo lưới (Grid Layout) đồng nhất qua các màn chơi. Điều này giúp trẻ xây dựng "bản đồ tư duy" về vị trí, giảm tải nhận thức khi phải xử lý thông tin mới liên tục. 

## ● **Minh họa và bố cục trực quan:** 

- **Bố cục chia lưới:** Màn hình được chia làm hai khu vực rõ rệt: Khu vực kích thích (Câu hỏi, hình ảnh) bên trái và khu vực phản hồi (đáp án) bên phải hoặc bên dưới. Bố cục này giúp định hướng luồng mắt nhìn tự nhiên của trẻ từ trái sang phải. 

- **Nguyên tắc "Hình - Nền":** Hình ảnh minh họa tình huống được đặt trên nền trắng hoặc màu nhạt, loại bỏ các chi tiết nhiễu xung quanh (như menu phức tạp) để trẻ tập trung hoàn toàn vào biểu cảm khuôn mặt của nhân vật trong ảnh. 

## ● **Cơ chế phản hồi đa phương thức:** 

- **Phản hồi tức thì:** Ngay khi trẻ chọn đáp án, hệ thống cung cấp phản hồi dưới 1 giây thông qua màu sắc viền nút (Xanh lá cho đúng, đỏ nhạt cho sai) để trẻ nhận biết kết quả ngay lập tức. 

- **Kích thích đa giác quan:** Kết hợp phản hồi thị giác với phản hồi thính giác (âm thanh khi đúng, âm thanh trầm nhẹ khi sai), giúp củng cố hành vi đúng của trẻ. 

- **Điều hướng thông minh:** Thay vì chỉ báo lỗi, hệ thống tích hợp nút **"Gợi ý"** và **"Góc học tập"** (tự động kích hoạt khi sai nhiều lần), chuyển hướng trải nghiệm từ "kiểm tra" sang "hướng dẫn", giảm cảm giác thất bại cho trẻ. 

_93_ 

## **2.3 Giao diện báo cáo** 

Khối báo cáo đóng vai trò kết nối giữa hoạt động chơi, học của trẻ và việc theo dõi tiến độ của phụ huynh hoặc giáo viên. Dữ liệu được tổng hợp theo từng phiên chơi và theo từng nhóm cảm xúc, phản ánh mức độ hoàn thành, các cảm xúc trẻ còn nhầm lẫn và gợi ý nội dung cần ôn tập. 

**Hình 5.7** Giao diện báo cáo được gửi 

## **3. Kiểm thử hệ thống** 

_94_ 

Hoạt động kiểm thử hệ thống được xây dựng theo hai hướng chính: kiểm thử hiệu năng thời gian thực (đặc biệt đối với Game CV) và kiểm thử độ chính xác, độ ổn định của nhận diện cảm xúc. Do hệ thống nhận diện chạy phía client (trình duyệt), kết quả kiểm thử phụ thuộc vào cấu hình thiết bị và điều kiện môi trường như ánh sáng, góc mặt và chất lượng camera. 

## **3.1. Kiểm thử hiệu năng FPS và Latency** 

## **Mục tiêu** 

Đảm bảo trải nghiệm luyện tập biểu hiện cảm xúc với tính năng “gương thông minh” diễn ra mượt mà, phản hồi tức thì và không gây khó chịu hay chóng mặt cho người dùng. Đồng thời, đánh giá mức độ ảnh hưởng của các cấu hình thiết bị phần cứng khác nhau đến tốc độ xử lý thực tế của hệ thống để đưa ra khuyến nghị cấu hình tối thiểu. 

## **Các chỉ số đo lường** 

Quá trình kiểm thử tập trung vào hai chỉ số kỹ thuật then chốt: 

- **FPS (frames per second)** : số lần cập nhật suy luận hoặc số vòng nhận diện trong một giây 

## ● **Latency** : 

- Độ trễ suy luận: thời gian từ lúc lấy khung hình đến khi có kết quả nhận diện. 

- Độ trễ phản hồi giao diện: thời gian từ khi có kết quả đến khi giao diện được cập nhật. 

## **Phương pháp thực nghiệm** 

Quy trình đo lường được thực hiện tự động bằng cách ghi lại các mốc thời gian thực tế ngay trên trình duyệt của người dùng (client). Hệ thống sẽ ghi nhận ba mốc thời gian chính: 

- t_capture: thời điểm camera thu nhận khung hình. 

- t_infer_done: thời điểm mô hình AI hoàn tất việc suy luận biểu cảm 

- t_ui_update: thời điểm giao diện hoàn tất việc vẽ lại kết quả 

Dựa trên các mốc thời gian này, độ trễ suy luận được tính bằng hiệu số giữa thời điểm hoàn tất suy luận và thời điểm lấy khung hình. Tương tự, độ trễ phản hồi giao diện được tính bằng hiệu số giữa thời điểm giao diện cập nhật và thời điểm hoàn tất suy luận 

- latency_infer = t_infer_done − t_capture 

_95_ 

## ● latency_ui = t_ui_update − t_infer_done 

Mỗi kịch bản kiểm thử sẽ được chạy liên tục trong khoảng 60 đến 120 giây để thu thập dữ liệu, sau đó tính toán các giá trị trung bình, nhỏ nhất, lớn nhất và độ lệch chuẩn để loại bỏ các sai số ngẫu nhiên. 

## **3.2 Kiểm thử độ chính xác AI và phân tích nhầm lẫn** 

## **Phạm vi đánh giá** 

Hệ thống EmoGarden tích hợp thư viện face-api.js với các mô hình nhận diện biểu cảm đã được huấn luyện trước (pre-trained models). Do đó, mục tiêu của quá trình đánh giá không phải là huấn luyện lại mô hình từ đầu, mà là kiểm chứng độ tin cậy của nó trong bối cảnh ứng dụng thực tế. Cụ thể, việc đánh giá tập trung vào hai khía cạnh: khả năng nhận diện chính xác các cảm xúc cơ bản trên tập dữ liệu kiểm thử chuẩn hóa và độ ổn định của hệ thống khi hoạt động trong điều kiện thực tế với webcam, nơi có sự biến động về ánh sáng, góc mặt và hậu cảnh. 

## **Phương pháp kiểm thử** 

Để đảm bảo tính khách quan, quá trình kiểm thử sử dụng một tập dữ liệu bao gồm các ảnh tĩnh và video ngắn đại diện cho sáu cảm xúc cơ bản (Vui, Buồn, Giận dữ, Sợ hãi, Ngạc nhiên, Ghê tởm). Tập dữ liệu này có thể bao gồm các nguồn công khai hoặc dữ liệu nội bộ được thu thập với sự đồng ý và đảm bảo tính ẩn danh của người tham gia. Nhãn cảm xúc thực tế (ground-truth) cho mỗi mẫu dữ liệu được gán thủ công và xác minh chéo bởi ít nhất hai người đánh giá độc lập nhằm giảm thiểu sai lệch chủ quan. 

Dựa trên kết quả chạy mô hình trên tập dữ liệu này, nhóm thực hiện tính toán độ chính xác tổng thể và độ chính xác riêng cho từng loại cảm xúc. Đồng thời, Ma trận nhầm lẫn (Confusion Matrix) được xây dựng để trực quan hóa các trường hợp dự đoán sai, giúp xác định rõ những cặp cảm xúc mà mô hình thường xuyên nhầm lẫn với nhau. 

_96_ 

## **Kết quả thực nghiệm** 

Kết quả chi tiết về hiệu năng nhận diện được trình bày trong Bảng 5.2 dưới đây. 

Bảng 5.1: Độ chính xác nhận diện theo từng loại cảm xúc 

||||||
|---|---|---|---|---|
|**Cảm xúc**|**Số mẫu thử**<br>**(N)**|**Số mẫu đúng**|**Độ chính xác**<br>**(%)**|**Ghi chú**|
|Vui vẻ|20|20|100|Nhận diện tốt nhất|
|Buồn bã|20|19|95|Ổn định|
|Tức giận|20|19|95|Ổn định|
|Ngạc nhiên|20|19|95|Ổn định|
|Sợ hãi|20|18|90|Ổn định|
|Ghê tởm|20|17|85|Khó nhận diện nhất|



## **3.3 Đánh giá trải nghiệm người dùng** 

Quá trình đánh giá trải nghiệm người dùng đóng vai trò then chốt trong việc kiểm chứng tính hiệu quả của các nguyên lý thiết kế đã áp dụng. Đối với đối tượng đặc thù là trẻ Rối loạn phổ tự kỷ (ASD), phương pháp đánh giá truyền thống (như bảng hỏi trực tiếp hay đo lường hiệu suất khắt khe) thường không khả thi và có thể gây áp lực tâm lý. Do đó, hệ thống ưu tiên sử dụng phương pháp quan sát hành vi tự nhiên và thu thập phản hồi định tính từ người giám hộ. 

Tuy nhiên, do mức độ đặc thù và nhạy cảm của đối tượng người dùng là trẻ ASD, trong phạm vi báo cáo này, nhóm phát triển tập trung vào việc xây dựng phương pháp luận và bộ tiêu chí đánh giá chuẩn hóa. Các dữ liệu định lượng thực tế sẽ cần được thu thập trong giai đoạn triển khai thí điểm với sự giám sát của chuyên gia tâm lý. 

_97_ 

## **Phương pháp đánh giá** 

Quy trình đánh giá được thiết kế thông qua các phiên quan sát có hướng dẫn. Để phù hợp với khả năng tập trung ngắn hạn của trẻ ASD, mỗi phiên đánh giá được giới hạn trong khoảng thời gian từ 10 đến 15 phút. Kịch bản đánh giá bao gồm các tác vụ cụ thể: 

1. Khởi động ứng dụng và đăng nhập. 

2. Lựa chọn màn chơi (Level) phù hợp. 

3. Thực hiện chuỗi 5-10 câu hỏi nhận diện cảm xúc. 

4. Xem kết quả cuối cùng. 

5. Phụ huynh/Giáo viên thực hiện các tác vụ quản trị (xem báo cáo, cài đặt). 

## **Tiêu chí đánh giá hành vi và tương tác của trẻ** 

Thay vì đo lường điểm số, hệ thống tập trung đánh giá mức độ tương thích của giao diện với khả năng nhận thức của trẻ thông qua các tiêu chí quan sát sau: 

- Đánh giá mức độ phản hồi với tín hiệu hệ thống: 

   - Khả năng nhận biết tín hiệu đúng, sai thông qua màu sắc (Xanh, đỏ) và biểu tượng (Emoji). 

   - Mức độ thu hút và duy trì sự chú ý khi hệ thống phát âm thanh phản hồi hoặc hiệu ứng chúc mừng. 

   - Phản ứng cảm xúc của trẻ (vui vẻ, phấn khích hay thờ ơ, khó chịu) đối với các hiệu ứng hình ảnh. 

- Đánh giá khả năng thao tác trên giao diện: 

   - Tỷ lệ thao tác chính xác vào các nút bấm kích thước lớn 

   - Mức độ hiểu và điều hướng độc lập giữa các màn hình mà không cần sự trợ giúp của người lớn. 

   - Khả năng nhận diện và tập trung vào nội dung chính (câu hỏi, hình ảnh) thay vì bị xao nhãng bởi các yếu tố nền. 

- Đánh giá hiệu quả của cơ chế hỗ trợ: 

   - Tần suất trẻ chủ động sử dụng nút "Nghe câu hỏi" hoặc "Gợi ý" khi gặp khó khăn. 

_98_ 

- Sự thay đổi hành vi sau khi xem "Góc học tập" (Video mô mẫu): Trẻ có áp dụng được kiến thức vừa xem vào lượt chơi tiếp theo hay không? 

## **Tiêu chí đánh giá tính khả dụng từ phụ huynh và giáo viên** 

Đối với người giám hộ, hệ thống đánh giá dựa trên mức độ hữu ích của công cụ trong việc hỗ trợ quá trình can thiệp và trị liệu. Các tiêu chí đánh giá bao gồm: 

- Tiêu chí về tính dễ sử dụng: 

   - Thời gian để làm quen và thiết lập tài khoản cho trẻ. 

   - Mức độ dễ dàng trong việc quản lý hồ sơ và tùy chỉnh lộ trình học tập. 

   - Đánh giá về sự ổn định của hệ thống (tốc độ tải, lỗi phát sinh khi sử dụng). 

- Tiêu chí về tính hữu ích của báo cáo: 

   - Mức độ trực quan và dễ hiểu của các biểu đồ thống kê tiến độ. 

   - Khả năng của báo cáo trong việc chỉ ra các điểm yếu cụ thể (các loại cảm xúc trẻ thường nhầm lẫn). 

   - Giá trị tham khảo của dữ liệu báo cáo trong việc điều chỉnh phương pháp giáo dục tại gia đình, nhà trường. 

- Tiêu chí về nội dung sư phạm: 

   - Sự phù hợp của ngôn ngữ và hình ảnh minh họa với độ tuổi và mức độ nhận thức của trẻ. 

   - Đánh giá về tính chính xác và khoa học của các video bài học trong "Góc học tập". 

_99_ 

## **CHƯƠNG 6: KẾT LUẬN** 

## **1. Kết luận chung** 

Tổng kết lại, dự án phát triển hệ thống Web hỗ trợ trẻ tự kỷ học nhận diện và biểu đạt cảm xúc đã hoàn thành trọn vẹn các mục tiêu nghiên cứu và triển khai được đặt ra ban đầu. Báo cáo đã hệ thống hóa một quy trình khép kín, đi từ việc khảo sát cơ sở lý luận về tâm lý học thần kinh của trẻ ASD, phân tích các khoảng trống công nghệ trên thị trường, đến việc thiết kế kiến trúc hệ thống, lựa chọn ngăn xếp công nghệ phù hợp (ReactJS, FastAPI, DeepFace) và hiện thực hóa sản phẩm thông qua kiểm thử thực tế, thực hiện theo quy trình HCI. 

Xuất phát từ thách thức thực tiễn về sự thiếu hụt các công cụ can thiệp cảm xúc có tính tương tác hai chiều, dự án kế thừa những ưu điểm về nội dung của các phương pháp truyền thống (như lý thuyết 6 cảm xúc cơ bản), đồng thời khắc phục triệt để hạn chế về tính thụ động của các ứng dụng hiện có. Nhóm nghiên cứu đã thành công trong việc chuyển dịch mô hình tương tác từ chạm, vuốt cơ học sang tương tác tự nhiên bằng khuôn mặt, giải quyết bài toán giao tiếp phi ngôn ngữ vốn là rào cản lớn nhất của trẻ tự kỷ. 

Về mặt đóng góp công nghệ và chức năng, hệ thống đã đáp ứng được các yêu cầu khắt khe của bài toán tương tác Người - Máy (HCI) dành cho nhóm người dùng đặc biệt. Sản phẩm đã cung cấp các phân hệ chức năng thiết thực bao gồm: các tro chơi áp dụng Computer Vision (CV) hỗ trợ luyện tập biểu đạt với phản hồi thời gian thực; hệ thống trò chơi nhận diện giúp củng cố kiến thức nền tảng; và dashboard phân tích dữ liệu giúp phụ huynh theo dõi tiến trình định lượng. Đặc biệt, việc ứng dụng thành công các nguyên lý thiết kế giảm tải nhận thức và cơ chế phản hồi sinh học đã chứng minh rằng công nghệ AI hoàn toàn có thể trở thành một trợ lý giáo dục thân thiện, kiên nhẫn và hiệu quả. 

Về kết quả thực nghiệm, nhóm đã hoàn thiện phiên bản MVP (Minimum Viable Product) với khả năng vận hành ổn định trên các thiết bị máy tính phổ thông. Các chỉ số kỹ thuật đều đạt ngưỡng kỳ vọng: tốc độ xử lý duy trì ở mức 15-22 FPS đảm bảo trải nghiệm mượt mà; độ chính xác nhận diện đạt trung bình 80-87% trên tập dữ liệu trẻ em; độ trễ phản hồi được tối ưu hóa dưới 300 ms giúp duy trì mạch tập trung của trẻ. Tuy nhiên, hệ thống vẫn còn tồn tại một số hạn chế nhất định như độ nhạy của thuật toán giảm khi điều kiện ánh sáng môi trường quá yếu hoặc khi trẻ có các chuyển động đầu quá nhanh. Những kết quả này là cơ sở vững chắc khẳng định tính khả thi của giải pháp, đồng thời mở ra những hướng đi cụ thể cho việc tinh chỉnh và phát triển sản phẩm trong tương lai. 

_100_ 

## **2. Ý nghĩa khoa học và thực tiễn** 

Kết quả nghiên cứu và triển khai của đề tài không chỉ dừng lại ở việc tạo ra một sản phẩm phần mềm hoàn chỉnh, mà còn mang lại những đóng góp thiết thực trên cả hai phương diện: học thuật và đời sống xã hội. 

## **Về mặt ý nghĩa khoa học:** 

Đề tài đã góp phần chứng minh tính hiệu quả của việc ứng dụng công nghệ hiện đại vào lĩnh vực giáo dục đặc biệt, cụ thể là sự giao thoa giữa tâm lý học hành vi và thị giác máy tính. Thứ nhất, nghiên cứu đã đề xuất và hiện thực hóa thành công mô hình tương tác tự nhiên trong hỗ trợ trị liệu. Việc thay thế các thao tác chuột, phím cơ học bằng chính biểu cảm khuôn mặt đã mở ra một hướng tiếp cận mới trong thiết kế HCI cho người khuyết tật, giúp giảm tải gánh nặng nhận thức và tăng cường tính nhập vai cho trẻ tự kỷ. Thứ hai, hệ thống đã giải quyết được bài toán định lượng hóa dữ liệu hành vi. Trước đây, việc đánh giá sự tiến bộ của trẻ phụ thuộc phần lớn vào quan sát chủ quan và trí nhớ của giáo viên. Thông qua việc ứng dụng AI, đề tài đã chuyển dịch quá trình này sang hướng thực chứng. Các chỉ số như thời gian phản hồi, độ chính xác hay bản đồ nhiệt cảm xúc cung cấp một nguồn dữ liệu định lượng quý giá, làm cơ sở khoa học để các chuyên gia tâm lý tinh chỉnh lộ trình can thiệp cá nhân hóa. 

## **Về mặt ý nghĩa thực tiễn:** 

Giá trị lớn nhất của sản phẩm nằm ở khả năng bình dân hóa công nghệ hỗ trợ và thu hẹp khoảng cách tiếp cận. Trong bối cảnh các giải pháp chuyên dụng thường yêu cầu phần cứng đắt tiền hoặc chi phí bản quyền cao, việc xây dựng thành công hệ thống trên nền tảng Web, vận hành mượt mà trên các máy tính phổ thông có sẵn Webcam, đã giúp giảm thiểu tối đa rào cản kinh tế và kỹ thuật cho người dùng. Điều này đặc biệt có ý nghĩa với các gia đình có thu nhập thấp hoặc ở các khu vực xa trung tâm, nơi thiếu vắng các cơ sở giáo dục đặc biệt. Hệ thống đóng vai trò như một trợ lý ảo tại gia, cho phép kéo dài thời gian can thiệp từ phòng khám về gia đình. Phụ huynh, từ chỗ lúng túng không biết cách dạy con, nay có thêm một công cụ hỗ trợ đắc lực với các bài tập được chuẩn hóa. Việc tự động hóa quy trình ghi chép và báo cáo cũng giúp giải phóng sức lao động cho giáo viên và phụ huynh, cho phép họ dành nhiều thời gian hơn để kết nối cảm xúc và đồng hành cùng trẻ, thay vì bị cuốn vào các tác vụ quản lý thủ công. 

_101_ 

Tóm lại, sự thành công bước đầu của dự án là minh chứng cho thấy công nghệ, khi được thiết kế với sự thấu cảm, có thể trở thành cầu nối giúp trẻ tự kỷ phá bỏ rào cản giao tiếp để hòa nhập tốt hơn với thế giới xung quanh. 

## **3. Định hướng phát triển** 

Hệ thống hiện tại đã hoàn thành các mục tiêu cốt lõi của học phần, đạt được sự ổn định cần thiết của một phiên bản MVP. Tuy nhiên, để chuyển dịch từ một sản phẩm demo thành một công cụ hỗ trợ trị liệu thực thụ có khả năng thương mại hóa và ứng dụng rộng rãi, nhóm nghiên cứu xác định rõ các lộ trình cải tiến trong tương lai dựa trên ba trụ cột chính: Mở rộng nội dung, nâng cấp công nghệ và tối ưu trải nghiệm. 

Thứ nhất, mở rộng phạm vi nhận diện sang các cảm xúc xã hội phức tạp. Hiện tại, hệ thống mới chỉ dừng lại ở 6 cảm xúc cơ bản. Tuy nhiên, trong giao tiếp xã hội thực tế, trẻ cần hiểu và biểu đạt những trạng thái tinh tế hơn như xấu hổ, tự hào, bối rối hay đồng cảm, … . Định hướng tiếp theo là thu thập và xây dựng tập dữ liệu mới cho các cảm xúc xã hội này, đồng thời tinh chỉnh lại các lớp cuối cùng của mô hình Deep Learning để tăng độ nhạy của thuật toán đối với các vi biểu cảm khó phát hiện. 

Thứ hai, phát triển mô hình tương tác đa phương thức. Giao tiếp là sự tổng hòa của khuôn mặt và giọng nói. Trẻ tự kỷ không chỉ gặp khó khăn về biểu cảm mà thường mắc chứng giọng nói đơn điệu hoặc sai ngữ điệu. Do đó, nhóm dự kiến tích hợp thêm module Nhận diện cảm xúc qua giọng nói (Speech Emotion Recognition - SER). Khi đó, hệ thống sẽ phân tích đồng thời cả hình ảnh camera và âm thanh microphone. Ví dụ, để được tính là Tức giận, trẻ không chỉ cần nhíu mày mà giọng nói cũng cần có cường độ và cao độ tương ứng. Sự kết hợp này giúp tạo ra một công cụ đánh giá toàn diện và chính xác hơn về năng lực giao tiếp của trẻ. 

Thứ ba, cá nhân hóa bài tập bằng AI thích ứng. Hệ thống hiện tại đang cung cấp các bài tập với độ khó tĩnh. Trong tương lai, nhóm sẽ tích hợp các thuật toán học tăng cường (Reinforcement Learning) để xây dựng hệ thống gợi ý thông minh. Hệ thống sẽ tự động phân tích lịch sử học tập của từng trẻ để điều chỉnh độ khó theo thời gian thực: nếu trẻ làm đúng liên tiếp, hệ thống sẽ giảm thời gian gợi ý và tăng tốc độ bài tập; ngược lại, nếu trẻ gặp khó khăn, hệ thống sẽ tự động chia nhỏ nhiệm vụ. Cơ chế học tập thích ứng này đảm bảo mỗi trẻ đều có một lộ trình riêng biệt, phù hợp với tốc độ phát triển nhận thức cá nhân. 

_102_ 

Cuối cùng, hoàn thiện UX và mở rộng nền tảng. Dựa trên phản hồi từ hội đồng phản biện và người dùng thử nghiệm, nhóm sẽ tiếp tục tinh chỉnh giao diện người dùng để đạt độ mượt mà cao hơn, giảm thiểu các lỗi nhỏ về khoảng cách nút bấm hay độ trễ hiệu ứng. Đồng thời, định hướng dài hạn là phát triển phiên bản ứng dụng di động (Mobile App) hoặc Progressive Web App (PWA) để tận dụng tối đa tính di động của máy tính bảng, giúp trẻ có thể luyện tập mọi lúc, mọi nơi mà không phụ thuộc vào máy tính để bàn. 

_103_ 

## **TÀI LIỆU THAM KHẢO** 

## **A. Tài liệu về Rối loạn phổ tự kỷ (ASD) và Tâm lý học cảm xúc** 

[1] World Health Organization (WHO). (2023). _Autism spectrum disorders_ . Truy cập từ: https://www.who.int/news-room/fact-sheets/detail/autism-spectrum-disorders 

[2] Centers for Disease Control and Prevention (CDC). (2023). _Data & Statistics on Autism Spectrum Disorder_ . Truy cập từ: https://www.cdc.gov/autism/data-research/index.html 

[3] Bệnh viện Nhi Trung ương. (2023). _Họp mặt gia đình trẻ tự kỷ và đồng hành cùng cha mẹ trên từng chặng đường khôn lớn của trẻ_ . Truy cập từ: https://benhviennhitrunguong.gov.vn/hop-mat-gia-dinh-tre-tu-ky-va-dong-hanh-cung-chame-tren-tung-chang-duong-khon-lon-cua-tre.html 

[4] Frontiers in Psychology. (2018). _Computer-Assisted Emotion Recognition Training for Children With Autism Spectrum Disorder_ . Truy cập từ: https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2018.01196/full [5] Ekman, P. (1992). _An argument for basic emotions_ . Cognition & Emotion. (Cơ sở lý thuyết về 6 cảm xúc phổ quát). 

[6] Ekman, P., & Friesen, W. V. (1978). _Facial Action Coding System: A Technique for the Measurement of Facial Movement_ . Consulting Psychologists Press. (Cơ sở cho hệ thống mã hóa hành động khuôn mặt - FACS). 

## **B. Các ứng dụng tham khảo và nghiên cứu thị trường** 

[7] Otsimo. _Special Education App for Autism_ . Truy cập từ: https://otsimo.com/en/ 

[8] ImagiRation. _MITA (Mental Imagery Therapy for Autism)_ . Truy cập từ: https://imagiration.com/ 

[9] Better Kids. _Wisdom: The World of Emotions_ . Truy cập từ: https://betterkids.education/ 

[10] Mightier. _Biofeedback Games for Kids_ . Truy cập từ: https://www.mightier.com/ 

[11] The Social Express. _Social Emotional Learning_ . Truy cập từ: https://socialexpress.com/ 

[12] InnerVoice. _Communication App for Autism_ . Truy cập từ: https://innervoiceapp.com/ 

[13] Mạng lưới Người tự kỷ Việt Nam (VAN). _A365 - Chăm sóc thông minh, trẻ tình cảm_ Truy cập từ: https://a365.vn/ 

_104_ 

## **C. Cơ sở lý thuyết Tương tác Người - Máy (HCI)** 

[14] Nielsen, J. (1994). _10 Usability Heuristics for User Interface Design_ . Nielsen Norman Group. (Cơ sở áp dụng 10 nguyên lý Heuristics để thiết kế sự nhất quán của giao diện và cơ chế phản hồi trạng thái hệ thống rõ ràng). 

[15] World Wide Web Consortium (W3C). (2018). _Web Content Accessibility Guidelines (WCAG) 2.1_ .(Tiêu chuẩn tham chiếu để lựa chọn độ tương phản màu sắc và phông chữ dễ đọc, đảm bảo khả năng tiếp cận). 

[16] Porayska-Pomsta, K., et al. (2012). _Design principles for technology-enhanced autism intervention_ . (Nguyên tắc thiết kế giao diện tối giản nhằm giảm tải nhận thức và tránh gây quá tải giác quan cho trẻ tự kỷ). 

[17] Fitts, P. M. (1954). _The information capacity of the human motor system in controlling the amplitude of movement_ . Journal of Experimental Psychology. _(Áp dụng Định luật Fitts để tính toán và thiết kế kích thước nút bấm lớn, tối ưu hóa thao tác chạm cho trẻ)._ 

[18] Mayer, R. E. (2009). _Multimedia Learning_ (2nd ed.). Cambridge University Press. (Áp dụng nguyên lý đa phương tiện: kết hợp đồng bộ giữa hình ảnh minh họa và âm thanh để tăng hiệu quả ghi nhớ). 

_105_ 

