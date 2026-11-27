# CHRONO — cửa hàng đồng hồ & không gian thực hành QA

Web HTML/CSS/JavaScript thuần, dữ liệu lưu localStorage. Bản 1.3 tập trung giao diện và kiểm thử; không cần backend/MySQL. Mã do AI hỗ trợ phát triển theo yêu cầu người dùng; xem [nguồn và minh chứng](docs/ai/AI-PROVENANCE.md).

## Chạy trên máy

Mở terminal ở thư mục có package.json:

```powershell
npm start
```

Mở [trang QA](http://127.0.0.1:5517/qa.html), [phòng thực hành](http://127.0.0.1:5517/lab.html), [quản lý cửa hàng](http://127.0.0.1:5517/index.html) hoặc [trang chủ](http://127.0.0.1:5517/home.html). Chỉ cần Node.js để phục vụ file; npm start không dùng package ngoài. Có thể dùng VS Code Go Live, nhưng cần đổi URL/cổng trong script công cụ cho khớp. Dùng cùng origin/cổng để giữ dữ liệu.

| Vai trò | Tài khoản | Mật khẩu thực hành |
|---|---|---|
| Admin | admin | Admin@123 |
| Nhân viên | staff | Staff@123 |

## Cấu trúc thư mục

Các trang HTML nằm ở gốc để giữ nguyên địa chỉ (`/home.html`, `/index.html`...); mã, tài liệu và kiểm thử gom theo vai trò.

```
.
├── *.html                 20 trang vào: 13 trang khách, quản lý (index), QA, phòng thực hành, hồ sơ 8 câu hỏi
├── css/
│   ├── admin/             styles.css (giao diện quản lý, QA dùng chung)
│   ├── storefront/        storefront.css, home.css (trang khách)
│   └── qa/                qa.css, lab.css, qa-portfolio.css
├── js/
│   ├── core/              store.js (quy tắc nghiệp vụ, dùng ở mọi nơi)
│   ├── admin/             app.js, icons.js, demo-data.js
│   ├── storefront/        storefront.js, home.js
│   └── qa/                qa.js, qa-runner.js, qa-cases.js, lab.js
├── assets/                font và ảnh minh họa
├── docs/
│   ├── product/           PRODUCT, DESIGN, ASSETS
│   ├── planning/          kế hoạch, thiết kế, loại kiểm thử, checklist
│   ├── test-cases/        CSV: 90 ca thủ công, 24 ca khách, 27 ca giao diện
│   ├── tools/             hướng dẫn Katalon, JMeter, Selenium IDE, tự động hóa, test bằng AI
│   ├── ai/                nguồn AI và hồ sơ bàn giao
│   ├── reports/           tổng kết, lỗi, xác minh, báo cáo đồ án (.docx)
│   ├── guides/            hướng dẫn sử dụng, chạy local, kịch bản bảo vệ
│   └── evidence/          ảnh, lịch sử thực thi và báo cáo theo từng đợt
├── tests/
│   ├── unit/              test Node (nghiệp vụ, dữ liệu demo, trang khách)
│   ├── e2e/               Playwright
│   ├── katalon/           22 script Groovy (KT-001…022)
│   ├── jmeter/            plan hiệu năng (.jmx)
│   └── selenium-ide/      aurel-ui.side
├── scripts/               máy chủ test, bộ sinh plan JMeter/Selenium IDE, kiểm tra cú pháp và liên kết
└── skills/                skill QA mẫu
```

Kiểm tra nhanh sau khi sửa: `npm run check` (cú pháp mọi tệp JS), `npm run check:links` (liên kết HTML/CSS/Markdown), `npm test` (Node), `npm run test:e2e` (Playwright).

## Giao diện và dữ liệu

- Cửa hàng: tìm/lọc bộ sưu tập, hiển thị sản phẩm từ dữ liệu local.
- Quản lý: sản phẩm và ảnh, khách hàng, danh mục, tài khoản staff, nhập kho, lịch sử kho, đơn hàng, báo cáo, xuất/nhập JSON, in phiếu.
- Quy tắc: mã sản phẩm không trùng sau trim/viết hoa; giá nguyên dương; tồn nguyên không âm. Đơn nháp không giữ kho, xác nhận kiểm tra mọi dòng trước khi trừ, hủy đơn xác nhận hoàn kho một lần. Giá lịch sử độc lập giá sản phẩm.
- Bộ gốc giữ 7 sản phẩm, 2 khách và không có đơn để test độc lập theo CSV.
- Bộ demo mở rộng: **18 sản phẩm, 10 khách, 18 đơn** trong 7 ngày; 10 xác nhận, 4 hủy, 4 nháp, có doanh thu, lịch sử kho và hàng cần nhập.

Nạp demo: admin → **Báo cáo → Xuất dữ liệu JSON** nếu cần giữ dữ liệu → **Nạp bộ dữ liệu demo** → đọc thông báo và xác nhận. Dữ liệu nghiệp vụ sẽ được thay, tài khoản và sổ QA được giữ. Đóng modal không ghi dữ liệu. Có thể nhập lại JSON đã xuất để khôi phục. Không tự nạp demo khi đang thực thi các ca yêu cầu bộ gốc.

Biểu tượng SVG bản 1.3 nằm trong dự án, không cần CDN. Ảnh qua URL HTTPS vẫn phụ thuộc máy chủ ảnh; ảnh tải từ máy lưu local. Đăng nhập/phân quyền chỉ mô phỏng frontend, có thể bị sửa bằng DevTools. Chỉ dùng dữ liệu thực hành.

## Không gian QA

[qa.html](qa.html) có **90 test case thủ công**, bộ **24 ca nghiệp vụ** trên dữ liệu riêng, nhiều đợt, truy vết yêu cầu, sổ lỗi và xuất JSON/CSV/Markdown. Pass/Fail cần kết quả thực tế và tham chiếu bằng chứng; Fail cần Bug ID. Blocked không tính là đã thực thi. 90 ca không tự chuyển Pass theo kết quả tự động.

Nút **Demo Fail mô phỏng** cố ý tạo một lỗi ở nhóm cơ bản; chạy lại để thấy Fail → Pass. Không tính lỗi cố ý này thành bug sản phẩm. Dữ liệu ca thủ công lưu tại chrono-qa-runs-v2, tách dữ liệu cửa hàng. Sao lưu từng đợt bằng JSON, không sửa cùng đợt ở nhiều tab đồng thời.

[lab.html](lab.html) có test design tương tác, prompt AI có thể chỉnh/tải, bộ Katalon, plan JMeter, skill mẫu và checklist bảo vệ. Công cụ prompt chỉ tạo văn bản; không tự gọi AI. Checklist không phải kết quả test.

## Katalon & JMeter

- [12 script Katalon](tests/katalon/): tạo test case trong Studio rồi dán vào Script View. Đọc [hướng dẫn và ma trận](docs/tools/KATALON.md). **Chưa chạy Katalon**, giữ Not Run đến khi có report thật.
- [JMeter plan](tests/jmeter/chrono-static.jmx): 8 HTTP request, mỗi request có assertion mã 200 và nội dung, cấu hình threads/loops/ramp/host/port. Đọc [hướng dẫn](docs/tools/JMETER.md). **Chưa chạy JMeter**. Plan chỉ đo HTTP tài nguyên, không chạy JS/localStorage hoặc nghiệp vụ bán hàng.

## Chạy bộ kiểm thử của dự án

Khi thiếu dependencies, chạy npm ci trước. Cấu hình dùng Chrome đã có trên Windows; máy khác cần cài Chromium của Playwright hoặc đặt CHRONO_BROWSER_CHANNEL phù hợp.

```powershell
npm ci
npm run check
npm test
npm run test:e2e
npm run report
```

Nếu thiếu trình duyệt: npx playwright install chromium. Suite tự mở server cổng 5517; dừng npm start trước khi chạy suite nếu đang dùng cùng cổng. Mỗi test có browser context riêng; không thay dữ liệu trình duyệt bạn đang dùng. Thời gian suite không phải số đo hiệu năng web.

Báo cáo trong playwright-report, ảnh/trace khi lỗi trong test-results. Xem [tổng kết thực thi](docs/reports/TEST-SUMMARY.md) để phân biệt kết quả hiện tại, lịch sử và phần chưa chạy.

## Hồ sơ bảo vệ

- [Hồ sơ 8 câu hỏi](qa-portfolio.html), [hướng dẫn local](docs/guides/LOCAL-DEMO.md), [hướng dẫn sử dụng ngắn](docs/guides/HUONG-DAN-SU-DUNG.md), [bàn giao Claude](docs/ai/CLAUDE-HANDOFF.md), [lịch sử thực thi 24 ca khách](docs/evidence/manual-claude-2026-11-26/LICH-SU-KIEM-THU.md), [lịch sử 27 ca giao diện/truy cập/bảo mật](docs/evidence/ui-claude-2026-11-26/LICH-SU-KIEM-THU-GIAO-DIEN.md), [các loại kiểm thử đã làm](docs/planning/LOAI-KIEM-THU.md), [Selenium IDE (không cần tài khoản)](docs/tools/SELENIUM-IDE.md).
- [Kế hoạch](docs/planning/TEST-PLAN.md), [test design](docs/planning/TEST-DESIGN.md), [90 ca CSV](docs/test-cases/TEST-CASES.csv).
- [AI hỗ trợ tester](docs/tools/AI-TESTING.md), [skill mẫu](skills/watch-qa/SKILL.md).
- [Kịch bản bảo vệ](docs/guides/DEFENSE.md), [bug report](docs/reports/BUG-REPORTS.md), [bản thảo báo cáo](docs/reports/REPORT.md).

Các tài liệu và file Word cũ là bản thảo, cần cập nhật thông tin sinh viên, ảnh hội thoại AI và kết quả Katalon/JMeter thật trước khi nộp. Không khẳng định số ca hoặc thời lượng demo là rubric giảng viên nếu chưa được cung cấp.
