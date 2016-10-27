# my-full-stack

A simple full-stack nodejs which gets image metadata from api.imgur.com, stores the first 100 image metadatas to MongoDB (hosted at mLab) and has an API for client.

Tests for database and API are done with Mocha, chai and chai-http.

Imgur used to have the image posts ID and image file names identical, so it would've been easy to get image url's per image ID, but now they are different. I used ID to render imgur embed instead of just one picture.

Included extra option for database refresh for client because its almost impossible to make up matching keywords with very old image data. Now the user can open imgur.com frontpage and check what to search.

The node is live at https://sick-awesome-app.herokuapp.com/
