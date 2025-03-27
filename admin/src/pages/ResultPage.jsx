import MainLayout from "../layouts/MainLayout";
import React, { useState, useEffect } from "react";
import axios from "axios";

function ResultPage() {
    const [dotBauCuList, setDotBauCuList] = useState([]);
    const [ketQuaList, setKetQuaList] = useState([]);
    const [dotBauCuDaChon, setDotBauCuDaChon] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const layDotBauCu = async () => {
            try {
                setLoading(true);
                const res = await axios.get("/api/dotbaucu/lay/daketthuc");
                setDotBauCuList(res.data);

                if (res.data.length > 0) {
                    setDotBauCuDaChon(res.data[1]);
                }
            } catch (err) {
                setError("Lỗi khi tải dữ liệu!");
                console.error("Lỗi API:", err);
            } finally {
                setLoading(false);
            }
        };

        layDotBauCu();
    }, []);

    console.log(dotBauCuDaChon)

    useEffect(() => {
        const layKetQua = async () => {
            if (!dotBauCuDaChon) return;
            try {
                setLoading(true);
                const res = await axios.get(`/api/dotbaucu/layketqua/${dotBauCuDaChon._id}`);
                setKetQuaList(res.data.winners);
                console.log(res.data.winners)
            } catch (err) {
                setError("Lỗi khi tải kết quả bầu cử!");
                console.error("Lỗi API:", err);
            } finally {
                setLoading(false);
            }
        };
        layKetQua();
    }, [dotBauCuDaChon]);

    if (loading) return <MainLayout><p>Đang tải...</p></MainLayout>;
    if (error) return <MainLayout><p className="text-red-500">{error}</p></MainLayout>;

    return (
        <MainLayout>
            <div className="w-full h-full p-3">
                <div className="flex justify-between items-center mb-3 cursor-pointer">
                    <h1 className="text-blue-950 text-4xl font-extrabold">KẾT QUẢ BẦU CỬ</h1>
                    <select
                        className="rounded-full shadow-lg px-4 py-2 border border-blue-950 text-blue-950 font-medium cursor-pointer hover:bg-blue-950 hover:text-white"
                        value={dotBauCuDaChon?._id || ""}
                        onChange={(e) => {
                            const dotBauCuMoi = dotBauCuList.find((d) => d._id === e.target.value);
                            setDotBauCuDaChon(dotBauCuMoi || null);
                        }}
                    >
                        <option value="" disabled>Chọn đợt bầu cử</option>
                        {dotBauCuList.map((d) => (
                            <option key={d._id} value={d._id}>
                                {d.tenDotBauCu}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="border-2 border-blue-950">
                    <div className="w-full bg-blue-950 text-white grid grid-cols-20 items-center font-semibold">
                        <div className="col-span-1 text-center border-r py-4 uppercase">#</div>
                        <div className="col-span-7 border-r py-4 text-center uppercase">Họ và Tên</div>
                        <div className="col-span-2 border-r py-4 text-center uppercase">Số lượng phiếu</div>
                        <div className="col-span-10 py-4 text-center uppercase">Hash vote</div>
                    </div>

                    {ketQuaList.length === 0 ? (
                        <div className="w-full py-4 text-center text-gray-500 font-medium">
                            Chưa có kết quả bầu cử nào.
                        </div>
                    ) : (
                        ketQuaList.map((k, index) => (
                            <div
                                key={k._id}
                                className="w-full grid grid-cols-20 items-center font-medium border-b border-gray-300"
                            >
                                <div className="col-span-1 text-center border-r py-4">{index + 1}</div>
                                <div className="col-span-7 border-r py-4 text-center">{k.thongTin.hoVaTen}</div>
                                <div className="col-span-2 border-r py-4 text-center">{k.diemSo}</div>
                                <div className="col-span-10 border-r py-4 text-center truncate">
                                    {k.bytesData.split(',').map((item, index) => (
                                        <div key={index}>{item}</div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </MainLayout>
    );
}

export default ResultPage;
