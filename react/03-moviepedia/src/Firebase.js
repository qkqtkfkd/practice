// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  limit,
  startAfter,
  exists,
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCvz8Qisd87WKhBx4cCUAyBaR23F2RVY7U",
  authDomain: "project0304-3ae26.firebaseapp.com",
  projectId: "project0304-3ae26",
  storageBucket: "project0304-3ae26.appspot.com",
  messagingSenderId: "994782413522",
  appId: "1:994782413522:web:1f5124361af658d00fa30b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);

async function getDatas(collectionName, options) {
  // throw new Error("에러가 아니라 기능입니다.");
  // const querySnapshot = await getDocs(collection(db, collectionName));
  let docQuery;
  if (options.lq === undefined) {
    docQuery = query(
      collection(db, collectionName),
      orderBy(options.order, "desc"),
      limit(options.limit)
    );
  } else {
    docQuery = query(
      collection(db, collectionName),
      orderBy(options.order, "desc"),
      startAfter(options.lq),
      limit(options.limit)
    );
  }
  const querySnapshot = await getDocs(docQuery);

  //쿼리 query
  //orderBy, limit, startAfter
  const result = querySnapshot.docs;
  const lastQuery = result[result.length - 1];

  //[snapshot1, snapshot2, 000,snapshot10];
  //result[0].data();
  const reviews = result.map((doc) => ({ docId: doc.id, ...doc.data() })); //스프레드 문법
  // const reviews = result.map((doc) => {
  //   const obj = doc.data();
  //   obj.dovId = doc.id;
  //   return obj;
  // }); -스프레드 문법 해석

  return { reviews, lastQuery };
}

async function deleteDatas(collectionName, docId, imgUrl){
  const storage = getStorage();
  const deleteRef = ref(storage, imgUrl);

  try{
    await deleteObject(deleteRef);
    await deleteDoc(doc(db, collectionName, docId));
  }catch(error){
    return false;
  }
  return true;
}

async function addDatas(collectionName, formData) {
  const uuid = crypto.randomUUID();
  const path = `movie/${uuid}`;
  const lastId = (await getLastId(collectionName)) + 1;
  const time = new Date().getTime();
  // 파일을 저장하고 url 을 받아온다.
  const url = await uploadImage(path, formData.imgUrl);

  formData.id = lastId;
  formData.createdAt = time;
  formData.updatedAt = time;
  formData.imgUrl = url;

  const result = await addDoc(collection(db, collectionName), formData);
  const docSnap = await getDoc(result);
  if (docSnap.exists()) {
    const review = { docId: docSnap.id, ...docSnap.data() };
    return { review };
  }
}

async function updateDatas(collectionName, formData, docId, imgUrl) {
  const docRef=aswit doc(db, collectionName, docId);

  const time= new Date().getTime();

  formData.imgUrl=imgUrl;
  formData.updatedAt=time;


//사진 파일을 변경했을 때
if (formData.imgUrl !===null){  
  //사진파일 업로드 및 업로드한 파일 경로 가져오기
  const uuid = crypto.randomUUID();
  const path = `movie/${uuid}`;  
  const url = await uploadImage(path, formData.imgUrl);

  //기존사진 삭제하기
  const storage=getStorage();
  const deleteRef=ref(storage, imgUrl);
  await deleteObject(deleteRef);

  //가져온 사진 경로 updateInfoObj 의 imgUrl 에 셋팅하기
  updateInfoObj.imgUrl=url;
}

//문서필드 데이터 수정
await updateDoc(docRef, formData);
const docData=await getDoc(docRef);
console.log("수정 성공!!");
}

async function uploadImage(path, imgFile) {
  const storage = getStorage();
  const imageRef = ref(storage, path);

  //File 객체를 스토리지에 저장
  await uploadBytes(imageRef, imgFile);

  //저장한 File의 url을 받아온다.
  const url = await getDownloadURL(imageRef);
  return url;
}

async function getLastId(collectionName) {
  const docQuery = query(
    collection(db, collectionName),
    orderBy("id", "desc"),
    limit(1)
  );
  const lastDoc = await getDocs(docQuery);
  const lastId = lastDoc.docs[0].id;
  return lastId;
}

export {
  db,
  getDocs,
  collection,
  getDatas,
  setDoc,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  addDatas,
  deleteDatas,
  updateDatas,
};
