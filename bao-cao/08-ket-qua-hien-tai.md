# 8. Kết quả hiện tại

## 8.1. Các chức năng đã hoàn thành

Hệ thống GangnamSign hiện đã có các chức năng chính có thể demo được:

- Đăng ký và đăng nhập tài khoản người dùng.
- Tạo và quản lý hồ sơ học sinh gắn với tài khoản.
- Hiển thị trang chủ và điều hướng đến các khu vực học tập chính.
- Hiển thị danh sách chủ đề học tập, bao gồm Gia đình, Màu sắc, Cảm xúc, Trường học và ASL Alphabet.
- Hiển thị lộ trình bài học theo từng topic.
- Hiển thị nội dung bài học với từ vựng, mô tả, gợi ý ký hiệu và hình minh họa.
- Làm quiz theo từng bài học và hiển thị phản hồi đúng/sai.
- Làm topic quiz để ôn tập nhiều bài trong cùng một chủ đề.
- Hiển thị kết quả sau khi hoàn thành bài học/quiz.
- Theo dõi tiến độ học tập, XP, sao, streak và badge.
- Hiển thị lịch sử quiz của topic.
- Luyện ký hiệu bằng camera/keypoint ở các màn hình practice và translate.
- Nhận diện ký hiệu bằng các dịch vụ backend: alphabet CNN, WLASL Transformer, landmark BiLSTM và chấm ký hiệu bằng Gemini khi cần.
- Hỗ trợ text-to-sign/sign-to-text ở màn hình translate khi có dữ liệu SignWriting, pose hoặc model tương ứng.
- Giao diện admin gồm tổng quan, quản lý nội dung, topic, lesson, chi tiết lesson và quiz.
- Backend cung cấp API cho auth, profile, topic, lesson, quiz, progress, report và translate.
- Seed dữ liệu ban đầu cho 5 topic, 38 lesson, 24 câu hỏi quiz và 3 badge.

## 8.2. Minh họa giao diện

> Ghi chú: các đường dẫn ảnh dưới đây đặt theo cấu trúc `bao-cao/screenshots/`. Khi chụp ảnh màn hình demo, lưu ảnh đúng tên file tương ứng để Markdown hiển thị trực tiếp.

### Màn hình trang chủ

![Trang chủ](screenshots/01-trang-chu.png)

Màn hình đầu tiên giới thiệu ứng dụng và điều hướng người dùng đến các chức năng học tập chính.

### Màn hình đăng nhập

![Đăng nhập](screenshots/02-dang-nhap.png)

Màn hình cho phép người dùng đăng nhập để truy cập hồ sơ, tiến độ học tập và các bài học đã lưu.

### Màn hình đăng ký

![Đăng ký](screenshots/03-dang-ky.png)

Màn hình tạo tài khoản mới cho học sinh, phụ huynh hoặc người quản lý học tập.

### Màn hình danh sách topic

![Danh sách topic](screenshots/04-danh-sach-topic.png)

Màn hình hiển thị các chủ đề học tập, mô tả ngắn, biểu tượng và tiến độ theo từng topic.

### Màn hình lộ trình bài học

![Lộ trình bài học](screenshots/05-lo-trinh-bai-hoc.png)

Màn hình thể hiện các lesson trong một topic theo dạng lộ trình, giúp người học biết bài nào đã hoàn thành và bài nào cần học tiếp.

### Màn hình bài học

![Bài học](screenshots/06-bai-hoc.png)

Màn hình trình bày từ vựng, mô tả, hình minh họa, gợi ý ký hiệu và hành động tiếp theo để luyện tập.

### Màn hình quiz bài học

![Quiz bài học](screenshots/07-quiz-bai-hoc.png)

Màn hình cho phép người học trả lời câu hỏi trắc nghiệm hoặc câu hỏi liên quan đến ký hiệu, kèm phản hồi sau từng câu.

### Màn hình kết quả

![Kết quả bài học](screenshots/08-ket-qua-bai-hoc.png)

Màn hình tổng kết kết quả sau bài học/quiz, gồm điểm, số câu đúng, XP và trạng thái hoàn thành.

### Màn hình topic quiz

![Topic quiz](screenshots/09-topic-quiz.png)

Màn hình ôn tập nhiều lesson trong cùng một topic để kiểm tra khả năng ghi nhớ tổng hợp.

### Màn hình lịch sử topic quiz

![Lịch sử topic quiz](screenshots/10-lich-su-topic-quiz.png)

Màn hình hiển thị các lần làm quiz trước đó để người học theo dõi tiến bộ theo thời gian.

### Màn hình practice camera

![Practice camera](screenshots/11-practice-camera.png)

Màn hình dùng camera để người học thực hiện ký hiệu, sau đó hệ thống trích xuất keypoint và trả về nhãn dự đoán.

### Màn hình translate

![Translate](screenshots/12-translate.png)

Màn hình hỗ trợ dịch giữa văn bản và ký hiệu, đồng thời có thể hiển thị SignWriting, pose hoặc kết quả nhận diện khi có dữ liệu.

### Màn hình communication

![Communication](screenshots/13-communication.png)

Màn hình tập trung vào các mẫu câu giao tiếp cơ bản, phù hợp cho việc luyện tập tình huống hằng ngày.

### Màn hình profile

![Profile](screenshots/14-profile.png)

Màn hình hiển thị thông tin hồ sơ, tiến độ học tập, thành tích và các chỉ số liên quan đến người học.

### Màn hình admin overview

![Admin overview](screenshots/15-admin-overview.png)

Màn hình tổng quan cho quản trị viên, giúp theo dõi nội dung, thống kê và tình trạng hệ thống.

### Màn hình quản lý topic

![Quản lý topic](screenshots/16-admin-topics.png)

Màn hình cho phép quản trị viên tạo, sửa, xóa và sắp xếp các topic học tập.

### Màn hình quản lý lesson

![Quản lý lesson](screenshots/17-admin-lessons.png)

Màn hình cho phép quản trị viên quản lý danh sách lesson, nội dung bài học và thông tin liên quan.

### Màn hình chi tiết lesson

![Chi tiết lesson](screenshots/18-admin-lesson-detail.png)

Màn hình chỉnh sửa chi tiết bài học, gồm phrase, mô tả, độ khó, XP, visual và gợi ý ký hiệu.

### Màn hình quản lý quiz

![Quản lý quiz](screenshots/19-admin-quizzes.png)

Màn hình cho phép quản trị viên quản lý ngân hàng câu hỏi, đáp án, gợi ý và liên kết câu hỏi với lesson/topic.

## 8.3. Đánh giá theo yêu cầu ban đầu

| Yêu cầu | Trạng thái | Ghi chú |
|---|---|---|
| Đăng ký, đăng nhập và bảo vệ API | Đã hoàn thành | Có route login/register ở frontend và router auth ở backend. |
| Tạo và quản lý hồ sơ học sinh | Đã hoàn thành | Có profile route, profile API và bảng dữ liệu liên quan. |
| Học theo topic | Đã hoàn thành | Có danh sách topic, lộ trình theo topic và seed dữ liệu ban đầu. |
| Bài học từ vựng/ký hiệu | Đã hoàn thành | Mỗi lesson có title, phrase, description, visual, sign hint, difficulty và XP. |
| Flashcard/luyện ghi nhớ | Đã hoàn thành một phần | Có màn hình practice và thành phần học tập; cần bổ sung thêm nội dung flashcard phong phú hơn. |
| Quiz theo lesson | Đã hoàn thành | Có route quiz theo lesson và dữ liệu câu hỏi mẫu. |
| Topic quiz | Đã hoàn thành | Có route topic quiz và lịch sử topic quiz. |
| Phản hồi đúng/sai | Đã hoàn thành | Quiz có xử lý đáp án, hint và màn hình kết quả. |
| Theo dõi tiến độ học tập | Đã hoàn thành | Có API progress, XP, star, streak, badge và result page. |
| Luyện ký hiệu bằng camera | Đã hoàn thành một phần | Có camera/keypoint extractor và API nhận diện; cần kiểm thử thêm với người dùng thật. |
| Nhận diện alphabet ASL | Đã hoàn thành một phần | Có model alphabet `.h5` và endpoint liên quan; độ ổn định thực tế cần đánh giá thêm. |
| Nhận diện word-level/WLASL | Đã hoàn thành một phần | Có WLASL Transformer và landmark BiLSTM; tập nhận diện còn giới hạn. |
| Text-to-sign/sign-to-text | Đã hoàn thành một phần | Có màn hình translate và dịch vụ SignWriting/pose; phụ thuộc dữ liệu sẵn có. |
| Quản trị topic, lesson, quiz | Đã hoàn thành | Có các route admin overview, content, topics, lessons, lesson detail và quizzes. |
| Báo cáo/thống kê người học | Đã hoàn thành một phần | Có router reports và admin overview; cần bổ sung đánh giá định lượng đầy đủ hơn. |
| Giao diện thân thiện với trẻ em | Đã hoàn thành một phần | Giao diện có màu sắc, icon, tiến độ và phần thưởng; cần usability testing với trẻ thật. |
| Hiệu năng và độ ổn định | Chưa hoàn thiện | Chưa có benchmark đầy đủ trên nhiều thiết bị, nhiều camera và điều kiện ánh sáng. |

## 8.4. Hạn chế hiện tại

Hệ thống đã có đầy đủ nền tảng demo, nhưng vẫn còn một số hạn chế cần nhìn nhận rõ:

- Dữ liệu học tập và dữ liệu ký hiệu còn ít so với nhu cầu sử dụng thực tế.
- Tập nhận diện của model còn giới hạn, đặc biệt với các ký hiệu liên tục và các câu dài.
- Model có kết quả validation tốt trong notebook nhưng chưa được đánh giá đầy đủ trên dữ liệu camera thực tế.
- Độ ổn định của nhận diện gesture có thể bị ảnh hưởng bởi ánh sáng, góc quay, khoảng cách, kích thước tay và tốc độ thực hiện ký hiệu.
- Giao diện cần được kiểm thử với người dùng thật, đặc biệt là trẻ khiếm thính, phụ huynh và giáo viên.
- Phản hồi khi người học ký hiệu sai còn cần chi tiết hơn, vì hiện tại mới chủ yếu trả về nhãn dự đoán, điểm tin cậy hoặc gợi ý tổng quát.
- Chưa có đánh giá định lượng đầy đủ về trải nghiệm người dùng, thời gian hoàn thành tác vụ, tỷ lệ lỗi và mức độ hài lòng.
- Chưa tối ưu hiệu năng toàn diện cho thiết bị yếu hoặc môi trường mạng không ổn định.
- Dữ liệu SignWriting, pose/video minh họa và nội dung bài học cần được mở rộng để tránh trải nghiệm học bị lặp lại.
- Chức năng admin đã có nền tảng CRUD nhưng cần thêm quy trình kiểm duyệt nội dung, validation và quản lý phiên bản bài học.
