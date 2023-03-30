import jwt from "jsonwebtoken";
        const token = jwt.sign(
            {
                email: "mateusz.lewczuk",
                userId: 123123123132123123,
            },
            "dupadupa11",
            {
                expiresIn:"1h",
            });
            console.log(token);