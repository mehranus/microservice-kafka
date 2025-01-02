
export type DataObject={
  name:string,
  email:string,
  password:string,
  userId:string,
  token:string,
  user:object
}

export type ResposeType={
  message:string,
  status:number,
  error:number,
  data:DataObject
}