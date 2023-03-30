import jwt from "jsonwebtoken";
        const token = jwt.sign(
            {
                email: "mateusz.lewczuk",
                userId: 123123123132123123,
            },
            "config.JWT_SECRET",
            {
                expiresIn:"1h",
            });
            console.log(token);