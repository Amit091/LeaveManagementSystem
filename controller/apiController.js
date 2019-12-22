const leave_SQL = require('../helpers/Dao/leave_form_SQL');
const leave_type_SQL = require('../helpers/Dao/Leave_type_SQL');

const lSQL = new leave_SQL();
const ltSQL = new leave_type_SQL();

exports.decideLeave = async(req,res)=>{
  try {
    console.log(req.body);
     let  id  = req.body.id;
    var user = req.body.user_id;
    var status =req.body.status;
    var reason = req.body.reason;    
    req.checkBody('id', 'Invalid User Data').notEmpty().isNumeric(); 
    req.checkBody('user_id', 'Invalid User Data').notEmpty().isNumeric(); 
    req.checkBody('status', 'Select specific LeaveType').notEmpty().isIn('reject','accept'); 
    reason =(reason=='')?(status=='accept')?'Accepted':reason:reason;
    console.log(reason);
    
    req.checkBody('reason', 'reason required').notEmpty();
   
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
          if(status == 'accept'){
            updateData = await lSQL.UpdateLeaveDataRecordStatus(data);   
            console.log(updateData);
          }
          else if( status == 'reject')
          { 
            updateData = await lSQL.UpdateLeaveDataRecordStatus(data);   
            console.log(updateData);            
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
    let data  =await lSQL.getAllUser(user);    
    res.send({ data}).status(200);
  } catch (error) {
    console.log(error);    
  }
};