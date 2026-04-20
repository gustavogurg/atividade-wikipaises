import { useParams } from 'react-router-dom'

function DetailPage() {
  const { code } = useParams()
  return <h1>Detalhe do país: {code}</h1>
}

export default DetailPage