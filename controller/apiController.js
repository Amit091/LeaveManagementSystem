const leave_SQL = require('../helpers/Dao/leave_form_SQL');
const leave_type_SQL = require('../helpers/Dao/Leave_type_SQL');
const user_SQL = require('./../helpers/Dao/users_SQL');

const lSQL = new leave_SQL();
const ltSQL = new leave_type_SQL();
const uSQL = new user_SQL();

exports.decideLeave = async(req,res)=>{
  try {
    console.log(req.body);
     let  id  = req.body.id;
    var user = req.body.user_id;
    var status =req.body.status;
    var reason = req.body.reason;    
    req.checkBody('id', 'Invalid User Data').notEmpty().isNumeric(); 
    req.checkBody('user_id', 'Invalid User Data').notEmpty().isNumeric(); 
    req.checkBody('status', 'Select specific LeaveType').notEmpty();
    reason =(reason=='')?(status=='accept')?'Accepted':reason:reason;
    console.log(reason);   
    var errors = req.validationErrors() || [];
    console.log(errors);
    
    if(errors.length > 0){
      res.status(400).send(errors);
    }else{
      let fromData = await lSQL.getLeaveDataRecordByIdandUser(id,user);
      console.log(fromData);
      var data = {'id':id,'user':user,'status':status,'reason':reason};
      
      console.log('#########################################################################################################################');
      if( fromData == 0){
        errors.push({'param':'user leave Data','msg':'Data of respective Query not found in Server','value':0});
        res.status(404).send('Data of respective Query not found in Server');
      }else if(fromData.status == 'pending'){
        var updateData;
        console.log(status);       
        //this update the user leave status applied  reject/accept
          if(status == 'accept'){
            updateData = await lSQL.UpdateLeaveDataRecordStatus(data);  
            //if(accept update the user leave Data) 
            //console.log(updateData);
          }
          else if( status == 'reject')
          { 
            updateData = await lSQL.UpdateLeaveDataRecordStatus(data);   
            //console.log(updateData);            
          }
           const list = await lSQL.getLeaveRecord();
          res.render('./partials/pageItem/tableViewFull', { list},(err,out)=>{
            if(err){
                console.log(err);
                res.send({ status: false });          
            }else{
                res.send({ htmlData: out, status: true });
            }
          });

      }else if(fromData.status != 'pending' && fromData.status =='accept' && status =='accept' ){
            let msg =`Leave Already  Accepted`;
            res.status(409).send({msg});
      }
      else if(fromData.status != 'pending' && fromData.status =='accept' && status =='accept' ){
            let msg =`Leave Already Rejected`;
            res.status(409).send({msg});
      }else{
        res.status(400).send('NO data Update');
      }
      console.log(fromData);
      if(status == fromData.status){
        
        return 'code for no changes';
      }
      else if(req.body.status == 'reject'){
        req.checkBody('reason', 'No. of Days of  Leave is Empty').notEmpty();
      }
      else{
          //no changes
      }
    }
  } catch (error) {
    console.log(error);    
  }
};

exports.getAllUser = async(req,res)=>{
  try {
    let user = req.query.query;  
    user = `%${user}%`;
    let data  =await uSQL.getAllUser(user);
    res.send({ data}).status(200);
  } catch (error) {
    console.log(error);    
  }
};

exports.getDataForModal = async(req,res)=>{
  try {
    let data= req.query;
    let record = await lSQL.getLeaveDataRecordByIdandUser(data.id,data.user_id);
    //console.log(record);    
    res.render('./partials/decisonModal', { record,status:data.status},(err,out)=>{
      if(err){
          res.send({ status: false });          
      }else{
          res.send({ htmlData: out, status: true });
      }
    });
  } catch (error) {
    console.log(error);    
  }
};