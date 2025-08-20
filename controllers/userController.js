const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const auth = require("../auth"); 
const { errorHandler } = require("../auth"); 

module.exports.checkEmailExists = (req, res) => {
  if(req.body.email.includes("@")){
    return User.find({ email : req.body.email })
      .then(result => {

          if (result.length > 0) {
              return res.status(409).send({message: "Email exists"});
          } else {
              return res.status(404).send(false);
          };
      })
      .catch(error => errorHandler(error, req, res));
  }
  else{
    res.status(400).send(false);
  }
};

const checkEmailExistHelper = (email) => {
    return User.find({ email : email })
    .then(result => {
        if (result.length > 0) {
            return true;
        } else {
            return false;
        };
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.registerUser = async (req, res) => {
    if(!req.body.email.includes("@")){
        return res.status(400).send(false);
    }

    const emailExist = await checkEmailExistHelper(req.body.email); 

    if(!emailExist){ 
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10),
            mobileNo: req.body.mobileNo
        });

        return newUser.save()
        .then((result) => {
            return res.send(result);
        })
        .catch((error) => errorHandler(error, req, res)); 
    }
    else{
        res.status(409).send({message: "Email already exist"})
    }
            
}

module.exports.loginUser = (req, res) => {
    if (req.body.email.includes("@")){
    return User.findOne({ email: req.body.email })
        .then((result) => {
    
        if(result == null){
            return { message: "User not found" };
        }
        else{				
            const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

            if(isPasswordCorrect){
                return res.send({ access: auth.createAccessToken(result)})
            }
            else{
                return res.send({ message: 'Incorrect email or password'  });
            }
        }
        })
        .catch((error) => errorHandler(error, req, res)); 
    }
    else{
        return res.status(400).send(false)
    }
};

module.exports.getProfile = (req, res) => {
    return User.findById(req.user.id)
    .then(user => {
        user.password = "";
        return res.send(user);
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.enroll = (req, res) => {
    if (req.user.isAdmin){
        return res.status(403).send(false)
    }
    let newEnrollment = new Enrollment({
        userId: req.user.id,
        enrolledCourses: req.body.enrolledCourses,
        totalPrice: req.body.totalPrice
    })
    return newEnrollment.save()
    .then(enrolled =>{
        return res.status(201).send(true)
    })
    .catch(error => errorHandler(error, req, res));
}

module.exports.resetPassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).json({ message: "New password is required." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { password: hashedPassword },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ message: "Password successfully updated." });
    } catch (error) {
        console.error("Password reset error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

module.exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, mobileNo } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, mobileNo },
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
}

module.exports.makeUserAdmin = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isAdmin = true;
    await user.save();

    res.status(200).json({ message: "User updated to admin successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};