import mongoose from "mongoose";

const nguoidungSchema = new mongoose.Schema(
    {
        username: {
			type: String,
            required: true,
            unique: true,
		},
        email: {
			type: String,
            required: true,
            unique: true,
		},
        matKhau: {
			type: String,
            required: true,
            minLength: 6,
		},
        moTaND: {
			type: String,
		},
        address:{
            type: String,
        },
        roleND: {
			type: String,
            required: true,
            enum: ["ADMIN", "ELECTION_CREATOR", "DISTRICT_MANAGER", "CANDIDATE_MANAGER", "VOTER_MANAGER", "ELECTION_VERIFIER"]
		},
        lanDau: {
            type: Boolean,
            default: true, 
        },    
        trangThai: {
            type: String,
            enum: ["Hoạt động", "Khóa"],
            default: "Hoạt động",
        },      
        idNguoiTao: { type: mongoose.Schema.Types.ObjectId, ref: "Nguoidung"},
    },{timestamps:true}
)

const Nguoidung = mongoose.model("Nguoidung", nguoidungSchema,"Nguoidung");

export default Nguoidung;