import { useEffect, useState } from "react";
import { singletonHook } from "react-singleton-hook";
import PhoneBookService from "../services/phonebook.service";

type InitialLabelType = {
	all_labels: string[];
};

const initStatus: InitialLabelType = {
    all_labels: [],
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let globalSet: any = () => {
	throw new Error('you must useFetchLabels before setting its state');
};

export const useFetchLabels=singletonHook(initStatus,()=> {
	
    const [all_labels, setAllLabels] = useState<InitialLabelType>(initStatus);
    globalSet = setAllLabels;

    useEffect(() => {
        PhoneBookService.allLabels().then((res) => {
            setAllLabels({
                all_labels: res,
            });
        });
    }, []);

    return all_labels;
})

export const setAllLabels = (data: InitialLabelType) => globalSet(data);

export const refresh = () => {
    setAllLabels({
        all_labels: [],
    });
};


