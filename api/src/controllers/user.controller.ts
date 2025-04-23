import { Request, Response, RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import User from '../model/user.model';
import { client } from '..';

export const register: RequestHandler = async (req: Request,res: Response): Promise<any> => {

    const {name,email,password} = req.body;
    try {
      if(!email || !name || !password){
        return res.status(400).json({
            success: false,
            message: "Missing Credentials"
        });
      }
      if(password.length < 6){
        return res.status(400).json({
            success: false,
            message: "Password must be atleast 6 character long"
        });
      }
      const existingUser = await User.findOne({email});
      if(existingUser){
        return res.status(400).json({
          success: false,
          message: "User Already Exists"
        })
      }
      const hashedPassword = await bcrypt.hash(password,10);

    const newUser = new User({
      name,
      email,
      password:hashedPassword
    })
    await newUser.save();    
    await client.upsertUser({
      id: newUser.id,
      name: newUser.name!,
      email: newUser.email!

    });
    const token = client.createToken(newUser.id);

      return res.status(201).json({
        success: true,
        message: "User has been successfully created ",
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name
        }

      })
    } catch (error: any) {
      console.log(error.message)
      return res.status(500).json({
        success: false,
        message: error.message
      })
    }
  
};
export const login: RequestHandler = async (req: Request,res: Response): Promise<any> => {
  const {email,password} = req.body;
  if(!email || !password){
    return res.status(400).json({
      success: false,
      message: "Missing Credentials"
    })
  };
 try {
    const user = await User.findOne({email});
    if(!user){
      return res.status(400).json({
        success: false,
        message: "User doesn't exists"
      })
    }
    const isMatch = await bcrypt.compare(password, user.password!);
    if(!isMatch){
      return res.status(400).json({
        success: false,
        message: "Bad Credentials"
      })
    }
    const token = client.createToken(user.id);
    return res.status(200).json({
      success: true,
      message: "Successfully logged in",
      token,
      user: {
        id: user.id,
        email: user.email
      }
    })
 } catch (error: any) {
      console.log(error.message)
      return res.status(500).json({
        success: false,
        message: error.message
      })
 }
};
