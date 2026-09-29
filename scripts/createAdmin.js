const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const Admin = require("../models/adminModel");

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        const existingAdmin = await Admin.findOne();
        if (existingAdmin) {
            console.log("Admin already exists.");
            console.log(`Admin email: ${existingAdmin.email}`);

            await mongoose.connection.close();
            process.exit(0);
        }

        const name = "RBW";
        const email = "admin@rbw.com";
        const password = "admin@123";

        const hashedPassword = await bcrypt.hash(password, 12);

        const admin = await Admin.create({
            name,
            email,
            password: hashedPassword,
            role: "admin",
            isActive: true
        });

        console.log("Admin created successfully!");

        await mongoose.connection.close();

    } catch (error) {
        console.error("Failed to create admin:");
        console.error(error);
        await mongoose.connection.close();
        process.exit(1);
    }
}

createAdmin();