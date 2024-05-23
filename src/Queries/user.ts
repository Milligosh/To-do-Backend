export const userQueries = {
    createNewUser: `
  INSERT INTO users(
      firstname,
      lastname,
      username,
      email,
      password,
      phonenumber
  )VALUES($1,$2,$3,$4,$5,$6)RETURNING id,firstname,username,email,phonenumber,created_at;
  `,
    fetchUserByEmail: `SELECT id, firstname, lastname, username, email, password, phonenumber, created_at FROM users WHERE email=$1`,
  
    fetchUserByUsername: `SELECT firstname,lastname,username,email,password,phonenumber FROM users WHERE username=$1`,
  };