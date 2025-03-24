import UngCuVien from "../models/ungcuvien.model.js";
import Nguoidung from "../models/nguoidung.model.js";
import {v2 as cloudinary} from 'cloudinary'
import CuTri from "../models/cutri.model.js";
import DonViBauCu from "../models/donvibaucu.model.js";
import DotBauCu from "../models/dotbaucu.model.js";
import { ethers } from "ethers";
import dotenv from "dotenv"
import abi from "../abi.js";
dotenv.config();

export const themUngCuVien = async (req, res) => {
    try {
        const {
            hinhAnh, idDonViBauCu, hoVaTen, ngaySinh, gioiTinh, quocTich, danToc, tonGiao, queQuan, noiO,
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

        let anhSPUrl = hinhAnh;

        if (hinhAnh) {
            try {
                const uploadResult = await cloudinary.uploader.upload(hinhAnh);
                anhSPUrl = uploadResult.secure_url;
            } catch (uploadError) {
                console.log("Lỗi upload ảnh ứng cử viên:", uploadError.message);
                return res.status(500).json({ error: "Lỗi khi upload ảnh ứng cử viên lên Cloudinary" });
            }
        }

        const ungCuVienMoi = new UngCuVien({
            hinhAnh: anhSPUrl,
            idDonViBauCu,
            hoVaTen,
            ngaySinh,
            gioiTinh,
            quocTich,
            danToc,
            tonGiao,
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

export const xoaUngCuVien = async (req, res) => {
    try {
        const { id } = req.params;
        const idNguoiXoa = req.nguoidung._id;

        const ungCuVien = await UngCuVien.findById(id);
        if (!ungCuVien) {
            return res.status(404).json({ message: "Không tìm thấy ứng cử viên!" });
        }

        if (ungCuVien.idNguoiTao.toString() !== idNguoiXoa.toString()) {
            return res.status(403).json({ message: "Bạn không có quyền xóa ứng cử viên này!" });
        }

        if (ungCuVien.trangThai !== "Chờ xét duyệt" && ungCuVien.trangThai !== "Từ chối") {
            return res.status(400).json({ message: "Chỉ có thể xóa ứng cử viên khi đang Chờ xét duyệt hoặc Từ chối!" });
        }

        await UngCuVien.findByIdAndDelete(id);
        res.status(200).json({ message: "Xóa ứng cử viên thành công!" });

    } catch (error) {
        console.error("Lỗi xoaUngCuVien controller:", error.message);
        res.status(500).json({ message: "Lỗi máy chủ!", error: error.message });
    }
};


export const duyetUngCuVien = async (req, res) => {
    try {
        const { candidateId, privateKey } = req.body;
        const idNguoiDuyet = req.nguoidung._id;

        const nguoiDuyet = await Nguoidung.findById(idNguoiDuyet);
        if (!nguoiDuyet) {
            return res.status(404).json({ message: "Không tìm thấy người dùng!" });
        }

        if (!privateKey) {
            return res.status(400).json({ message: "Cần nhập private key để duyệt bầu cử!" });
        }

        if (nguoiDuyet.roleND !== "ELECTION_VERIFIER") {
            return res.status(403).json({ message: "Bạn không có quyền duyệt ứng cử viên!" });
        }

        const candidate = await UngCuVien.findById(candidateId);
        if (!candidate) {
            return res.status(404).json({ message: "Không tìm thấy ứng cử viên!" });
        }

        const provider = new ethers.JsonRpcProvider(process.env.INFURA_API_URL);
        const signer = new ethers.Wallet(privateKey, provider);
        const adminAddress = nguoiDuyet.address; 

        if (signer.address.toLowerCase() !== adminAddress.toLowerCase()) {
            return res.status(403).json({ message: "Private key không khớp với tài khoản admin!" });
        }

        if (candidate.trangThai !== "Chờ xét duyệt") {
            return res.status(400).json({
                message: "Chỉ có thể cập nhật khi trạng thái là 'Chờ xét duyệt'!",
            });
        }

        

        // Cập nhật trạng thái trong database
        candidate.trangThai = "Chưa diễn ra";
        candidate.idNguoiDuyet = idNguoiDuyet;
        candidate.thoiGianDuyet = new Date();
        await candidate.save();

        // Gọi smart contract để xác nhận trên blockchain
        const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, signer);
        const tx = await contract.addCandidate(
            candidate._id.toString(),                 
            candidate.idDotBauCu.toString(),  
            candidate.idDonViBauCu.toString(),
            candidate.hoVaTen,               
            candidate.ngaySinh
        );

        await tx.wait(); // Chờ giao dịch hoàn tất

        return res.json({ 
            message: "Duyệt ứng cử viên thành công trên blockchain!", 
            transactionHash: tx.hash 
        });

    } catch (error) {
        console.error("Lỗi duyệt ứng cử viên:", error);
        return res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
};


export const layUngCuVienTheoId = async (req, res) => {
    try {
        const { id } = req.params;

        const ungCuVien = await UngCuVien.findById(id)
            .populate("idNguoiTao", "username")
            .populate("idNguoiDuyet", "username");

        if (!ungCuVien) {
            return res.status(404).json({ message: "Không tìm thấy ứng cử viên!" });
        }

        res.status(200).json(ungCuVien);
    } catch (error) {
        console.error("Lỗi khi lấy ứng cử viên theo ID:", error);
        res.status(500).json({ message: "Lỗi máy chủ!", error: error.message });
    }
};

export const capNhatTrangThaiUCV = async (req, res) => {
    try {
        const { id } = req.params;
        const { trangThaiMoi } = req.body;
        const idNguoiDuyet = req.nguoidung._id;

        const nguoiDuyet = await Nguoidung.findById(idNguoiDuyet);
        if (!nguoiDuyet) {
            return res.status(404).json({ message: "Không tìm thấy người dùng!" });
        }

        if (nguoiDuyet.roleND !== "ELECTION_VERIFIER") {
            return res.status(403).json({ message: "Bạn không có quyền cập nhật trạng thái!" });
        }

        const ungCuVien = await UngCuVien.findById(id);
        if (!ungCuVien) {
            return res.status(404).json({ message: "Không tìm thấy ứng cử viên!" });
        }

        if (ungCuVien.trangThai !== "Chờ xét duyệt") {
            return res.status(400).json({
                message: "Chỉ có thể cập nhật khi trạng thái là 'Chờ xét duyệt'!",
            });
        }

        ungCuVien.trangThai = trangThaiMoi;
        ungCuVien.idNguoiDuyet = idNguoiDuyet;
        ungCuVien.thoiGianDuyet = new Date();

        await ungCuVien.save();

        res.status(200).json({
            message: "Cập nhật trạng thái thành công!"
        });

    } catch (error) {
        console.error("Lỗi capNhatTrangThaiUCV controller:", error.message);
        res.status(500).json({ message: "Lỗi máy chủ!", error: error.message });
    }
};

export const getUngCuVienByCuTri = async (req, res) => {
    try {
        const idCuTri = req.cutri._id;
        console.log("id cu tri", idCuTri);

        const result = await CuTri.aggregate([
            {
                $match: { _id: idCuTri } // Tìm cử tri theo ID
            },
            {
                $lookup: {
                    from: "DonViBauCu", // Liên kết với đơn vị bầu cử
                    let: { capTinhId: "$diaChi.capTinh.id", capHuyenId: "$diaChi.capHuyen.id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$capTinh.id", "$$capTinhId"] },
                                        { $in: ["$$capHuyenId", "$capHuyen.id"] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "donViBauCu"
                }
            },
            { $unwind: "$donViBauCu" }, // Chuyển đơn vị bầu cử thành object thay vì array
            {
                $lookup: {
                    from: "DotBauCu", // Liên kết với đợt bầu cử
                    localField: "donViBauCu.idDotBauCu",
                    foreignField: "_id",
                    as: "dotBauCu"
                }
            },
            {
                $unwind: {
                    path: "$dotBauCu",
                    preserveNullAndEmptyArrays: false // Chỉ lấy các đợt bầu cử có tồn tại
                }
            },
            {
                $match: { "dotBauCu.trangThai": "Đang diễn ra" } // Lọc ra đợt bầu cử đang diễn ra
            },
            {
                $lookup: {
                    from: "UngCuVien", // Lấy danh sách ứng cử viên
                    let: { donViId: "$donViBauCu._id", dotId: "$dotBauCu._id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$idDonViBauCu", "$$donViId"] },
                                        { $eq: ["$idDotBauCu", "$$dotId"] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "ungCuViens"
                }
            },
            {
                $project: {
                    _id: 0,
                    donViBauCu: 1, // Lấy toàn bộ thông tin đơn vị bầu cử
                    dotBauCu: 1, // Lấy toàn bộ thông tin đợt bầu cử
                    ungCuViens: 1 // Lấy toàn bộ thông tin ứng cử viên
                }
            }
        ]);

        if (!result.length) {
            return res.json({ success: false, message: "Không tìm thấy ứng cử viên nào" });
        }

        return res.json({ success: true, data: result[0] });
    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: "Lỗi khi lấy danh sách ứng cử viên" });
    }
};
