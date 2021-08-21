import React, { useState } from 'react';
import './App.css';
import Amplify, { Storage } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import awsconfig from './aws-exports';
import { AmplifySignOut } from '@aws-amplify/ui-react';

Amplify.configure(awsconfig);

const App = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const downloadUrl = async () => {
    const downloadUrl = await Storage.get('picture.jpg', { level: 'public', expires: 10 });
    window.location.href = downloadUrl
  }

  const handleChange = async (e) => {
    const file = e.target.files[0];
    try {
      //setLoading(true);
      Storage.put('picture.jpg', file, {
        progressCallback(progress) {
            console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
        },
      });
      //await Storage.put('picture.jpg', file, {
       // level: 'private',
        //contentType: 'image/jpg'
      //});
      const url = await Storage.get('picture.jpg', { level: 'public' })
      setImageUrl(url);
      //setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="App">
      <h1> Upload a CVS File </h1>
      
      <input
        type="file" accept='image/jpg'
        onChange={(evt) => handleChange(evt)}
      />
      <div>
        {imageUrl ? <img style={{ width: "30rem" }} src={imageUrl} /> : <span />}
      </div>
      <div>
        <h2>URL</h2>
        <p>{imageUrl}</p>
      </div>
      <p><AmplifySignOut/></p>
    </div>
  );
}

export default withAuthenticator(App);
