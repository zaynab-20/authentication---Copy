const scoreModel = require('../models/score');
const userModel = require('../models/user');

exports.createScores = async (req, res) =>{
    try {
        const {userId} = req.params;
        const {punctuality, assignment,attendance, classAssessment, personalDefence} = req.body;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: 'student not found'
            })
        }
        const prevScores = await scoreModel.find({userId});
        const totalScore = punctuality + assignment+attendance+ classAssessment+ personalDefence;
        const score = new scoreModel[{
            week: prevScores.length + 1,
            punctuality, 
            assignment,
            attendance, 
            classAssessment, 
            personalDefence,
            average: totalScore/5,
            total: totalScore,
            name: user.fullName,
            userId
        }]
        await score.save();

        res.status(200).json({
            message: 'score added successfully',
            data: score
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: 'internal server error'
        })
    }
}


exports.getAllScores = async (req, res) => {
    try {
        const scores = await scoreModel.find();
        res.status(200).json({
            message: 'All scores in the database',
            data: scores
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'internal server Error'
        })
    }
}
exports.getAllScoresByStudent = async (req, res) =>{
    try {
        const {userId} = req.user;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(200).json({
                message: 'student not found'
            })
        }
        const scores = await userModel.find({userId});
        return res.status(200).json({
            message: `All scores for ${user.fullName}`,
            data: scores
        })

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            message: 'internal server error'
        })
    }
}