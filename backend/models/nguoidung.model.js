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
        anhDaiDienND: {
			type: String,
		},
        moTaND: {
			type: String,
		},
        roleND: {
			type: String,
		},
    },{timestamps:true}
)

const Nguoidung = mongoose.model("Nguoidung", nguoidungSchema,"Nguoidung");

export default Nguoidung;