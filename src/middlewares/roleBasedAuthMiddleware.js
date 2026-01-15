

const authorize = (roles = []) => {
    return (req, res, next) => {

        console.log('User role is: ', req.user.role);
        console.log('User name: ', req.user.name);
        
        if(!roles.includes(req.user.role)) {
            return res.status(400).json({message: 'forbidden: not authorized'});
        }

        next();
    }
}

export default authorize;