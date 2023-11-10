export default function showToast(toastRef:any,severity:any, summary:string, detail:string)  {
    if (toastRef.current) {
      toastRef.current?.show({ severity, summary, detail });
    }
  };