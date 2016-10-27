# my-full-stack

A simple full-stack nodejs which gets image metadata from api.imgur.com, stores the first 100 image metadatas to MongoDB (hosted at mLab) and has an API for client.
Tests for database and API are done with Mocha, chai and chai-http.
Included extra option for database refresh for client because its almost impossible to make up matching keywords with very old image data.
The node is live at https://sick-awesome-app.herokuapp.com/
