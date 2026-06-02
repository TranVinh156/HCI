# Kết luận

GangnamSign là một hệ thống học ngôn ngữ ký hiệu theo hướng trực quan, tương tác và phù hợp với người học nhỏ tuổi. Hệ thống không chỉ cung cấp nội dung bài học tĩnh, mà còn kết hợp topic, lesson, quiz, camera practice, tiến độ học tập, phần thưởng và quản trị nội dung để tạo thành một trải nghiệm học có cấu trúc.

Qua quá trình thiết kế và triển khai, nhóm đã xây dựng được nền tảng client-server gồm frontend React, backend FastAPI, cơ sở dữ liệu PostgreSQL và các dịch vụ nhận diện ký hiệu. Các chức năng như đăng nhập, hồ sơ học sinh, học theo topic, làm quiz, theo dõi tiến độ, luyện ký hiệu bằng camera và quản trị nội dung đã có thể demo được. Notebook huấn luyện cũng cho thấy mô hình landmark BiLSTM đạt validation accuracy 89.90% và top-3 accuracy 96.10% trên tập dữ liệu cân bằng, tạo cơ sở ban đầu cho chức năng nhận diện gesture.

Tuy vậy, hệ thống vẫn còn nhiều hạn chế cần tiếp tục cải thiện. Dữ liệu ký hiệu còn ít, model chưa được đánh giá đầy đủ trên môi trường camera thực tế, giao diện chưa qua kiểm thử với trẻ khiếm thính và chưa có đánh giá định lượng đầy đủ về hiệu quả học tập. Ngoài ra, các chức năng phản hồi khi ký hiệu sai, tối ưu hiệu năng và mở rộng nội dung vẫn cần được phát triển thêm.

Trong tương lai, GangnamSign nên tập trung vào mở rộng dữ liệu, cải thiện độ ổn định của nhận diện gesture, cá nhân hóa lộ trình học, bổ sung feedback chi tiết và kiểm thử với người dùng thật. Nếu các hướng này được thực hiện, hệ thống có thể trở thành một công cụ hỗ trợ học ngôn ngữ ký hiệu hữu ích hơn cho trẻ khiếm thính, phụ huynh và giáo viên trong môi trường học tập thực tế.
