import UngCuVien from "../models/ungcuvien.model.JS";

export const themUngCuVien = async (req, res) => {
    try {
        const {
            hoVaTen, ngaySinh, gioiTinh, quocTich, danToc, queQuan, noiO,
            trinhDoHocVan, ngheNghiep, noiCongTac, ngayVaoDang, laDaiBieuQH, laDaiBieuHDND,
        } = req.body;

        //console.log(req.body);
        const idNguoiTao = req.nguoidung._id;

        const nguoiTao = await Nguoidung.findById(idNguoiTao);
        if (!nguoiTao) {
            return res.status(404).json({ message: "Không tìm thấy người dùng!" });
        }

        if (nguoiTao.roleND !== "CANDIDATE_MANAGER") {
            return res.status(403).json({ message: "Bạn không có quyền thêm ứng cử viên!" });
        }

        if (
            !queQuan ||
            !queQuan.capTinh ||
            !queQuan.capHuyen ||
            !queQuan.capXa
        ) {
            return res.status(400).json({ message: "Địa chỉ quê quán không hợp lệ!" });
        }

        const ungCuVienMoi = new UngCuVien({
            hoVaTen,
            ngaySinh,
            gioiTinh,
            quocTich,
            danToc,
            queQuan: {
                capTinh: {
                    id: queQuan.capTinh.id,
                    ten: queQuan.capTinh.name,
                },
                capHuyen: {
                    id: queQuan.capHuyen.id,
                    ten: queQuan.capHuyen.name,
                },
                capXa: {
                    id: queQuan.capXa.id,
                    ten: queQuan.capXa.name,
                },
            },
            noiO,
            trinhDoHocVan: {
                phoThong: trinhDoHocVan?.phoThong,
                chuyenMon: trinhDoHocVan?.chuyenMon,
                hocVi: trinhDoHocVan?.hocVi,
                lyLuan: trinhDoHocVan?.lyLuan,
                ngoaiNgu: trinhDoHocVan?.ngoaiNgu,
            },
            ngheNghiep,
            noiCongTac,
            ngayVaoDang,
            laDaiBieuQH: laDaiBieuQH,
            laDaiBieuHDND: laDaiBieuHDND,
            idNguoiTao,
        });

        await ungCuVienMoi.save();
        res.status(201).json({ message: "Thêm ứng cử viên thành công!", ungCuVien: ungCuVienMoi });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!", error: error.message });
        console.log(error.message);
    }
};

export const layDanhSachUngCuVien = async (req, res) => {
    try {
        const danhSach = await UngCuVien.find()
        .populate("idNguoiTao", "username")
        .populate({
            path: "idNguoiDuyet",
            select: "username",
            match: { _id: { $ne: null } }
        })
        .sort({ hoVaTen: 1 });

        return res.status(200).json(danhSach);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách ứng cử viên:", error);
        return res.status(500).json({ message: "Lỗi máy chủ!" });
    }
};