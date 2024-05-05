# self-ordering

Anggota kelompok:

Jason Permana - 535220002

Arya Wira Kristanto - 535220004

Nicholas Martin - 535220027

Kevin Jonathan JM - 535220038


Contoh Tampilan Website McDini:

![SCREENSHOT 1](public/assets/Screenshot_1.png)

![SCREENSHOT 2](public/assets/Screenshot_2.png)

![SCREENSHOT 3](public/assets/Screenshot_3.png)

Website can be run by running "npm run start"
This website will run on port 3000 (localhost:3000)

The menu data is available in public/data/data_menu.json
Make sure to put it in McDini database inside menus collection in MongoDB

Admin account can be created by adding field role: 'admin' manually in the document inside users collection or via code such as

const newAdmin = new User({
    username: 'admin',
    email: 'admin@mcdini.com',
    password: '12345',
    role: 'admin',
  });
  
newAdmin.save()
.then(admin => {
    console.log('New admin created:', admin);
})
.catch(err => {
    console.error('Error creating admin:', err);
});

The above admin account will be created automatically when the program starts.

You can login by entering

email: admin@mcdini.com
password: 12345

in the login popup.
