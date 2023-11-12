import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { SyntheticEvent, useRef, useState } from 'react';



export default function Search(props: { searchAction: Function, allAction: Function }) {
    const searchInput = useRef<HTMLInputElement>(null)
    const [key ,setKey ] = useState<string>("")
    const handleSearch = () => {
        if (!searchInput.current?.value) return;
        props.searchAction(searchInput.current?.value)
    }

    const handleAll = () => {
        props.allAction()
    }

    return <div style={{ width: "50%", margin: "auto" }}>
        <div className="p-inputgroup">
            <InputText width={"500px"} onChange={(e:any)=>{if (e.target.value === "" ) {
                handleAll()
            }}} placeholder="Search" ref={searchInput} />
            <Button icon="pi pi-search" className="p-button-primary" onClick={(e:any)=>{
                handleSearch()
            }} onChange={(e:any)=>{setKey(e.target.value), localStorage.setItem ("key",key)}}/>
        </div>
    </div>
}