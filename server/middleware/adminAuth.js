export const adminAuth = (req, res, next) => {
  const secret = req.headers['x-admin-secret'];
  console.log('Admin auth attempt:', {
    provided: secret,
    expected: process.env.ADMIN_SECRET,
    match: secret === process.env.ADMIN_SECRET
  });
  
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ message: 'Unauthorized admin access' });
  }
  next();
};
