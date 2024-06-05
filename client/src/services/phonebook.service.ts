import APIInstance from "../config/APIInstance";

export class PhonebookService{
    public static async getPhonebook(){
        try{
            const {data} = await APIInstance.get('/phonebook');
            console.log(data);
            return data;
        }
        catch(err){
            //ignore
        }
    }
}