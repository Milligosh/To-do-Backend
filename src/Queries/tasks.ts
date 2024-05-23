export const taskQueries = {
  createTask: `
        INSERT INTO tasks (
            userId,
            task,
            priority
        ) VALUES ($1, $2, $3) RETURNING *`,

  
checkUserExist: `SELECT 
  users.id
     FROM users 
  LEFT JOIN 
  tasks ON
   tasks.userId =users.id WHERE users.id=$1`,

checkIfTaskExist:`SELECT * FROM tasks where id=$1`,
fetchTaskbyId: `Select id,task,priority FROM tasks where id=$1`,


   fetchAllTasksForAUser: `SELECT userId, id,task, priority, completed, created_at
   FROM tasks
   WHERE 1=1 `,
   deleteTask: ` DELETE FROM tasks WHERE id=$1`,
   updateTask: `UPDATE tasks SET task=$1,priority=$2, completed=$3 WHERE id=$4 RETURNING *`
}
