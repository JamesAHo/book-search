const {AuthenticationError} = require("apollo-server-express");
const {User} = require("../models");
const {signToken} = require('../utils/auth')

const resolvers = {
    Query: {
        me: async(parent, arg , context) => {
            if(context.user) {
                const userData = await User.findOne({_id: context.user._id}).select("-__v -password");
                    return userData;
            }
            throw new AuthenticationError('Please log in')
        },
       
    },
    Mutation: {
        createUser: async(parent, args) => {
            const user = await User.create(args)
            const token = signToken(user);
            return {token, user}
        },
        login: async (parent, {email, password}) => {
            const user = await User.findOne({email});

            if(!user) {
                throw new AuthenticationError('Incorrect Information');
            }
            const correctPw = await User.isCorrectPassword(password);
            if(!correctPw) {
                throw new AuthenticationError('Incorrect Information');
            }
            const token = signToken(user);
            return {token, user};
        },
        removeBook: async(parent, {bookId}, context) => {
            if(context.user){
                const updateUser = await User.findOneAndUpdate(
                    {_id: context.user._id}, {$pull: {savedBooks: {bookId}}},{new: true}
                );
                return updateUser;
            }
            throw new AuthenticationError('Please logged in')
        },
    },





};
module.exports = resolvers;
