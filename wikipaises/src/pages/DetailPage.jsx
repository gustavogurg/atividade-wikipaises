import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCountryByCode } from '../services/countriesApi'

function DetailPage() {
    const { code } = useParams()
    const [country, setCountry] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        loadCountry()
    }, [code])

    async function loadCountry() {
        try {
            setLoading(true)
            setError('')
            const data = await getCountryByCode(code)
            setCountry(data)
        } catch {
            setError('Nao foi possivel carregar os detalhes do pais.')
        } finally {
            setLoading(false)
        }
    }

    function formatPopulation(value) {
        return new Intl.NumberFormat('pt-BR').format(value ?? 0)
    }

    function formatArea(value) {
        return new Intl.NumberFormat('pt-BR').format(value ?? 0) + ' km2'
    }

    const languages = country?.languages
        ? Object.values(country.languages).join(', ')
        : 'N/A'

    const currencies = country?.currencies
        ? Object.entries(country.currencies)
            .map(([currencyCode, currency]) => {
                const name = currency?.name || 'Moeda'
                const symbol = currency?.symbol ? ' ' + currency.symbol : ''
                return name + ' (' + currencyCode + ')' + symbol
            })
            .join(', ')
        : 'N/A'

    const pastel = {
        pageBg: '#fef7fb',
        panelBg: '#ffffffcc',
        border: '#ebdff0',
        title: '#5f3d6e',
        text: '#66506f',
        softText: '#7a6684',
        buttonBg: '#f6eafd',
        buttonBorder: '#dcc5eb',
        buttonText: '#5f3d6e',
        blockBg: '#fffafb',
        shadow: '0 8px 18px rgba(126, 90, 150, 0.12)'
    }

    return (
        <main style={{
            padding: '32px 24px 48px',
            fontFamily: 'Arial, sans-serif',
            textAlign: 'left',
            width: '100%',
            maxWidth: 'none',
            minHeight: '100svh',
            margin: 0,
            boxSizing: 'border-box',
            backgroundColor: pastel.pageBg,
            background: `linear-gradient(165deg, ${pastel.pageBg} 0%, #f9f6ff 100%)`,
            border: `1px solid ${pastel.border}`,
            color: pastel.text
        }}>


            {loading && <p style={{ color: pastel.softText }}>Carregando detalhes...</p>}
            {error && <p style={{ color: '#b35454' }}>{error}</p>}

            {!loading && !error && country && (
                <>
                    <img
                        src={country.flags?.png}
                        alt={'Bandeira de ' + (country.name?.common || 'pais')}
                        style={{ width: '100%', maxWidth: '440px', borderRadius: '14px', marginBottom: '16px', border: `1px solid ${pastel.border}`, boxShadow: pastel.shadow }}
                    />

                    <h1 style={{ marginBottom: '18px', color: pastel.title }}>
                        {country.name?.official || 'N/A'} ({''}
                        {country.cca3 || 'N/A'}
                        )
                    </h1>
                    <p style={{ marginTop: 0, marginBottom: '22px', color: pastel.softText }}>
                        Também conhecido por: {country.name?.common || 'N/A'}
                    </p>

                    <section
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                            gap: '16px',
                            marginBottom: '24px'
                        }}
                    >
                        <InfoBlock label="Capital" value={country.capital?.[0] || 'N/A'} />
                        <InfoBlock label="Continente" value={country.region || 'N/A'} />
                        <InfoBlock label="Sub-regiao" value={country.subregion || 'N/A'} />
                        <InfoBlock label="Area" value={formatArea(country.area)} />
                        <InfoBlock label="Populacao" value={formatPopulation(country.population)} />
                        <InfoBlock label="Idiomas" value={languages} />
                        <InfoBlock label="Moeda" value={currencies} />
                    </section>

                    <section style={{
                        background: pastel.panelBg,
                        border: `1px solid ${pastel.border}`,
                        borderRadius: '14px',
                        padding: '14px 16px'
                    }}>
                        <h2 style={{ color: pastel.title, marginBottom: '10px' }}>Sobre o país</h2>
                        <p style={{ color: pastel.text }}>
                            Este país possui rica diversidade cultural, historica e geografica.
                        </p>
                    </section>

                    <Link to="/" style={{ display: 'inline-block', marginTop: '18px', marginBottom: '18px', textDecoration: 'none' }}>
                        <button
                            style={{
                                padding: '9px 14px',
                                border: `1px solid ${pastel.buttonBorder}`,
                                borderRadius: '10px',
                                background: pastel.buttonBg,
                                color: pastel.buttonText,
                                cursor: 'pointer',
                                fontWeight: 600,
                            }}
                        >
                            ←  Voltar para a lista
                        </button>
                    </Link>
                </>
            )}
        </main>
    )
}

function InfoBlock({ label, value }) {
    return (
        <article
            style={{
                border: '1px solid #ebdff0',
                borderRadius: '12px',
                padding: '14px',
                background: '#fffafb',
                boxShadow: '0 8px 18px rgba(126, 90, 150, 0.10)'
            }}
        >
            <h3 style={{ margin: '0 0 7px', fontSize: '14px', color: '#6d5277' }}>{label}</h3>
            <p style={{ margin: 0, color: '#4f3f57' }}>{value}</p>
        </article>
    )
}

export default DetailPage
