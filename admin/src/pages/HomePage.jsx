import React from 'react'
import MainLayout from '../layouts/MainLayout'

function HomePage() {
    return (
        <MainLayout>
           <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg overflow-hidden border border-gray-300">
        <div className="bg-blue-950 text-white text-center py-3">
          <h1 className="text-xl font-bold">QUY ĐỊNH QUẢN LÝ BẦU CỬ</h1>
        </div>
        <div className="p-6 text-gray-800">
          <section className="mb-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">1. Quản lý Ứng cử viên</h2>
            <ul className="list-disc list-inside text-gray-600">
              <li>Phê duyệt và xác minh thông tin ứng cử viên.</li>
              <li>Gỡ bỏ hoặc đình chỉ ứng cử viên nếu vi phạm quy định.</li>
              <li>Quản lý danh sách ứng cử viên theo từng đơn vị bầu cử.</li>
            </ul>
          </section>
          
          <section className="mb-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">2. Quản lý Cử tri</h2>
            <ul className="list-disc list-inside text-gray-600">
              <li>Xác minh danh tính và đăng ký cử tri.</li>
              <li>Giám sát hoạt động bỏ phiếu để tránh gian lận.</li>
              <li>Hủy quyền bầu cử nếu có dấu hiệu vi phạm.</li>
            </ul>
          </section>
          
          <section className="mb-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">3. Quản lý Đơn vị bầu cử</h2>
            <ul className="list-disc list-inside text-gray-600">
              <li>Thiết lập và cập nhật thông tin các đơn vị bầu cử.</li>
              <li>Phân bổ ứng cử viên theo từng đơn vị.</li>
              <li>Quản lý danh sách cử tri theo khu vực.</li>
            </ul>
          </section>
          
          <section className="mb-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">4. Quản lý Đợt bầu cử</h2>
            <ul className="list-disc list-inside text-gray-600">
              <li>Tạo và cấu hình đợt bầu cử mới.</li>
              <li>Xác định thời gian mở - đóng cổng bỏ phiếu.</li>
              <li>Giám sát tiến trình và giải quyết sự cố.</li>
            </ul>
          </section>
          
          <section className="mb-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">5. Cách lấy kết quả</h2>
            <p className="text-gray-600 leading-relaxed">
              Kết quả bầu cử sẽ được công bố trên hệ thống quản lý. Admin có quyền truy xuất dữ liệu, xuất báo cáo và xác minh kết quả trước khi công bố chính thức.
            </p>
          </section>
          

        </div>
      </div>
    </div>
        </MainLayout>
    )
}

export default HomePage