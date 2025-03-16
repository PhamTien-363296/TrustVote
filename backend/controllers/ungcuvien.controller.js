import UngCuVien from "../models/ungcuvien.model.js";
import Nguoidung from "../models/nguoidung.model.js";
import Web3 from "web3";
import contractABI from "../config/ABI.js";
import contractAddr from '../config/ContractAddress.js';

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

export const duyetUngCuVien = async (req, res) => {
    try {
        // Lấy candidateId từ body
        const { candidateId } = req.body;

        // Tìm ứng cử viên trong MongoDB
        const candidate = await UngCuVien.findById(candidateId);
        if (!candidate) {
            return res.status(404).json({ message: "Không tìm thấy ứng cử viên!" });
        }

        // Cập nhật trạng thái duyệt (ví dụ: trạng thái "Chưa diễn ra" hoặc "approved" theo logic của bạn)
        candidate.trangThai = "Chưa diễn ra";

        // Thiết lập kết nối tới Ganache qua Web3 (đảm bảo Ganache đang chạy tại cổng 7545)
        const web3 = new Web3("HTTP://127.0.0.1:7545");

        // Khởi tạo smart contract với ABI và địa chỉ contract
        const contract = new web3.eth.Contract(contractABI, contractAddr);

        // Lấy tài khoản mặc định từ Ganache (tài khoản này cần có đủ ETH để gửi giao dịch)
        const accounts = await web3.eth.getAccounts();
        const defaultAccount = accounts[0];

        // Gọi hàm addCandidate trên smart contract với thông tin ứng cử viên
        // Giả sử hàm addCandidate của smart contract có dạng: addCandidate(string memory _hoVaTen, string memory _id)
        const tx = await contract.methods
            .addCandidate(candidate.hoVaTen.toString(), candidateId.toString())
            .send({ from: defaultAccount, gas: 500000 });

        // Hàm replacer để chuyển đổi các giá trị BigInt thành chuỗi
        const replacer = (key, value) =>
            typeof value === "bigint" ? value.toString() : value;

        // Chuyển candidate và tx thành plain object an toàn cho JSON serialization
        const safeCandidate = JSON.parse(JSON.stringify(candidate.toObject(), replacer));
        const safeTx = JSON.parse(JSON.stringify(tx, replacer));

        return res.status(200).json({
            message: "Duyệt ứng cử viên thành công, dữ liệu đã được thêm vào blockchain!",
            candidate: safeCandidate,
            tx: safeTx,
        });
    } catch (error) {
        console.error("Lỗi duyệt ứng cử viên:", error);
        return res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
};