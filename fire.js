import {initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore} from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";

const serviceAccount = {
  "type": "service_account",
  "project_id": "flightmanagement-firebase",
  "private_key_id": "a3d901ec1fb18472ae44e2655b699e16dfe5f3aa",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCvNcvFBPeZrax5\n1ZdGv0Sc9EKAZt/sg6p4LJhAoniNprcNcicIjLcnFm0Sm/rr2rIKsflCgYnTPaFU\nZNdfdsWaorY+5k+GvZHvaAI6p98IF8STfrlZpOtvi+XTXZzAb/3x4YRTXOrZD2GY\nCW48PKa6G2QJ47ygLWGTKhVfaf9G/UJAlogTmSARi4ptw49sPoAUrKPVniBwiuBr\nfk8Mma9cyebOG2hkMZjxTPltyq+M1284233cCWXdVketAiI9316QcvXv064QOYRO\nL1mmj30xh/15bm0bKzsqwYrHzveIgBL5oOQ6DYqltQEcdq6HliVqGItXpdq7nrvd\nvaQ3jDRDAgMBAAECggEACekzSByc/D/zPYcOrMKoA8WGDNOvlKY+r9fnRYy14LQO\nrxTceWLVqhaI1UsmeU310Ui6TqqbhxakOBe7iRu5AiN0cgAUJ+KJopm8ZTYBaz3w\n8YjzEiDpQnY5lL27CWBXDzt7AT4vI1fNOkzvmTpdvLGiSd7sg2uzFSCFyfpp0B7u\nU4PUtLsLH94rWrL7jYN1cILZ8iVr8f4hs/IKJG/9NKdekepXncbuQ+UP0ZFk7JcK\nkavn3nA+1xHUuoFH6GQdXaksD7v3xkQFD1QYcZFvHKIUxiIyGjTQUjvlahdL+Olz\nRpcknVRFFt9ySY3iB25KE0aQT1kgmJyN9B0ogpPcWQKBgQDjzI7CIM7tykG2X1m5\nBxcF8ieWCBTqo3+q8PnqY2/xsL8ndhdNS8fCDAZQWQNAUv1CIazq7XrIhFggwUmo\noQnC/xa5XZ/AcPHKB8QFdByBro7hc4M6+wI3+ueFmEmeknOBqxFImKpX3n22DXVr\n9ZewWGx4PgL8SABiGZ7L32e52wKBgQDE5pUdTJ0c+yJtqu1kyabvA2PjI2dvjHi9\nhiLhgMqD3N7Y5c3t/nICETrw2vcGlcdntDRHnVn8lnyAvRuHkq6EHbCYcb6o9BU8\ntU/Bycrmj2a35qOC8FJ0j6aq09XQ07MJKUnEaNm/x48NNToTTZ5dwiI76wFOXMv9\n5jQAhK4/uQKBgQCt7uqx30sg1WYHUha36Gnz6EnBjLorzlsUspqgFPzMlh/eiZSR\nOGN2DqhjgROycatea0gUuO8fW63OlMchMpS5hvxa3Nm1nod/sx5A6784ZYhDLGfv\nCOlQxQsyPm033qrDP1MbEzY9kWx7LRuTKxp/U4S+6tpstq1UOiu9jv8sMQKBgF62\nG1vwklJyamkeIvqsFOQ7WTzUtthtVVa0wup9rOwovfjO8XNdRTHBX/yjFtfQDA7S\nG6OnCLX7HQA/9pIL+G4MafmqHO/gGKcO/8JTconcyKgFBPni54ax4pWhN+QvMJtj\nhNw5IySgtSrBQ6ItX9Pxoc34iLRM5sLGjJUDPV3hAoGBAMknTWDTD1Jrsx//l58E\nUHtr0dtvqq+waK7OHMlDTiDB/woo797u8VlLT5+pdskvHi+TYlat//dON/OT5dDC\nfl+xWGYeKYilIgufn7adebOhKv67csHX9KKANeLY7sKdZLAYFxtays0YQK+EuQqd\nD40Jlp+5ugDXm3uLZzu9SPZP\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-7nob2@flightmanagement-firebase.iam.gserviceaccount.com",
  "client_id": "107351179344340555855",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-7nob2%40flightmanagement-firebase.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

export const sendMessage = async (name) => {
    initializeApp({
      credential: cert(serviceAccount)
    });
    
    const db = getFirestore();
    // var user = await sessionStorage.getItem('username');
    console.log("Logged in user : ", name)
    
    const ref = db.collection('userFCM').doc(name);
    const doc = await ref.get();
    var registrationToken = null;
    if (!doc.exists) {
      console.log('No such document!');
    } else {
      console.log('User FCM:', doc.data()['FCMToken']);
      registrationToken = doc.data()['FCMToken'];
    }
    if(registrationToken)
    {
      const message = {
        data: {
          message: 'Hello '+name+'! You have a new ticket!',
        },
        token: registrationToken
      };
      getMessaging().send(message)
        .then((response) => {
          console.log('Successfully sent message:', response);
        })
        .catch((error) => {
          console.log('Error sending message:', error);
        });
    }
}
