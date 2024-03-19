//DB tables required:

// 1. User Table: Name, Email, Phone Number, Hashed Password, Balance
// 2. Actions Table: Action Name, Action Cost, Action Performed, Date and Time.
// 3. Credit History: User Id, Transaction Amount, Type of Transaction(Credit, Debit or Expiry of Credits), Transaction Status, Time and Date, Details, Tags
// 4. Expiry Details: User Id, Amount, Date and Time.

// API Endpoints required:

// 1. /addMoney
// 2. /performAction

//Assuming the Model for user is User and it has a field of balance.

let User;
let Action;
let Transaction; 

const getBalance = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user?.balance;
  } catch (error) {
    return error.message;
  }
};

const creditAccount = async (userId, amount) => {
  try {
    const user = await User.findById(userId);
    user.balance += amount;
    await user.save();
    const transaction = await Transaction.create({
      userId,
      amount,
      type: "credit",
      status: "successful",
    });
    return { user, transaction };
  } catch (error) {
    await Transaction.create({
      userId,
      amount,
      type: "credit",
      status: "failed",
      details: error.message,
    });
    return error.message;
  }
};

const deductCredits = async (userId, actionId) => {
  try {
    const user = await User.findById(userId);
    const action = await Action.findById(actionId);
    if (user.balance > action.cost) {
      user.balance -= action.cost;
      await user.save();
      const transaction = await Transaction.create({
        userId,
        amount,
        type: "debit",
        status: "successful",
        details: action.detail,
      });
    } else {
      throw new Error("Balance is low for the transaction.");
    }
  } catch (error) {
    await Transaction.create({
      userId,
      amount,
      type: "debit",
      status: "failed",
      details: error.message,
    });
    return error.message;
  }
};

const checkLowBal = async (userId, amount) => {
  try {
    const user = await User.findById(userId);
    if (user.balance < amount) {
      return "The balance is low.";
    }
    return "Balance is not low.";
  } catch (error) {
    return error.message;
  }
};

// var CronJob = require("cron").CronJob;

new CronJob({
  cronTime: '0 0 0 * * *',
  onTick: function () {
    //Need to find the details of all the transaction 
    //and then check if there is some balance left from the amount added 
    //before 30 days from now.



  },
  start: true,
  timeZone: "Asia/Kolkata",
});
