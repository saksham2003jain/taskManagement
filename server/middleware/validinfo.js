module.exports = (req, res, next) => {
    const { name, email, password, role } = req.body;

    function validE(e) {
        const patt = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return patt.test(e);
    }

    if (req.path === "/register") {
        if (![name, email, password, role].every(Boolean)) {
            return res.status(401).json("Missing Credentials.");
        } else if (!validE(email)) {
            return res.status(401).json("Invalid Email.");
        }
    } else if (req.path === "/login") {
        if (![email, password].every(Boolean)) {
            return res.status(401).json("Missing Credentials");
        } else if (!validE(email)) {
            return res.status(401).json("Invalid Email.");
        }
    }

    next();
};