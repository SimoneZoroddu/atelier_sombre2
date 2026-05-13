import { useShop } from "../contexts/GlobalContext";
/* importing loader animation */
import { DotStream } from 'ldrs/react'
import 'ldrs/react/DotStream.css'

export default function Loader({ color = '#EEF3F2' }) {

  const { loading } = useShop();

  if (!loading) return null;

  return (
    <DotStream
      size="60"
      speed="2.5"
      color={color}
    />
  )
}


/* 📌 Usage guide:

For default color (#EEF3F2) use `<Loader />`

🌈 For other colors use `<Loader color="yourColorHere" />`
*/