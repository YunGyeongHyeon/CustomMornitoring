
export const JsonStringifyList = (list1: any[] = [], list2: any[] = [])=>{
    
    const temp = [...list1, ...list2].map((v, i)=>{
        return {pk: v.id, value: v.data}
      });
      alert(temp)
      if(temp.length === 0){
          return null
      }else{
      
          return JSON.stringify(temp)
      }

}