import axios from 'axios';

// Configurações das APIs reais
const API_CONFIGS = {
  // HaveIBeenPwned - Free tier permite consultas
  HIBP_BASE_URL: 'https://haveibeenpwned.com/api/v3',
  
  // IPInfo.io - 50k requests/month grátis
  IPINFO_BASE_URL: 'https://ipinfo.io',
  
  // WhoisXML API - 1000 requests/month grátis  
  WHOIS_BASE_URL: 'https://www.whoisxmlapi.com/whoisserver/WhoisService',
  
  // Hunter.io - 25 searches/month grátis
  HUNTER_BASE_URL: 'https://api.hunter.io/v2',
  
  // VirusTotal - 500 requests/day grátis
  VIRUSTOTAL_BASE_URL: 'https://www.virustotal.com/vtapi/v2',
  
  // Shodan - 100 queries/month grátis
  SHODAN_BASE_URL: 'https://api.shodan.io'
};

// Interface para resultados padronizados
export interface OSINTResult {
  success: boolean;
  data?: any;
  error?: string;
  source: string;
  timestamp: string;
}

/**
 * Email OSINT - HaveIBeenPwned
 */
export async function checkEmailBreaches(email: string): Promise<OSINTResult> {
  try {
    const response = await axios.get(
      `${API_CONFIGS.HIBP_BASE_URL}/breachedaccount/${encodeURIComponent(email)}`,
      {
        headers: {
          'User-Agent': 'OSINT-Panel-Team'
        },
        timeout: 10000
      }
    );

    return {
      success: true,
      data: {
        email,
        breaches: response.data,
        breachCount: response.data.length,
        details: response.data.map((breach: any) => ({
          name: breach.Name,
          domain: breach.Domain,
          breachDate: breach.BreachDate,
          dataClasses: breach.DataClasses,
          description: breach.Description
        }))
      },
      source: 'HaveIBeenPwned',
      timestamp: new Date().toISOString()
    };
  } catch (error: any) {
    if (error.response?.status === 404) {
      return {
        success: true,
        data: {
          email,
          breaches: [],
          breachCount: 0,
          message: 'Nenhum vazamento encontrado para este email'
        },
        source: 'HaveIBeenPwned',
        timestamp: new Date().toISOString()
      };
    }

    return {
      success: false,
      error: error.message || 'Erro ao consultar vazamentos',
      source: 'HaveIBeenPwned',
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * IP Geolocation - IPInfo.io
 */
export async function getIPGeolocation(ip: string): Promise<OSINTResult> {
  try {
    const response = await axios.get(
      `${API_CONFIGS.IPINFO_BASE_URL}/${ip}/json`,
      {
        timeout: 10000
      }
    );

    return {
      success: true,
      data: {
        ip: response.data.ip,
        city: response.data.city,
        region: response.data.region,
        country: response.data.country,
        location: response.data.loc,
        isp: response.data.org,
        timezone: response.data.timezone,
        postal: response.data.postal,
        hostname: response.data.hostname,
        details: response.data
      },
      source: 'IPInfo.io',
      timestamp: new Date().toISOString()
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Erro ao obter geolocalização',
      source: 'IPInfo.io',
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Domain WHOIS - DNS lookup básico
 */
export async function getDomainInfo(domain: string): Promise<OSINTResult> {
  try {
    // DNS lookup básico usando resolvers públicos
    const dnsResponse = await axios.get(
      `https://dns.google/resolve?name=${domain}&type=A`,
      {
        timeout: 10000
      }
    );

    // Informações básicas do domínio
    const domainInfo = {
      domain,
      status: dnsResponse.data.Status === 0 ? 'Active' : 'Not Found',
      records: dnsResponse.data.Answer || [],
      nameservers: [],
      ips: dnsResponse.data.Answer?.filter((r: any) => r.type === 1)
        .map((r: any) => r.data) || []
    };

    // Tentar obter informações adicionais
    try {
      const nsResponse = await axios.get(
        `https://dns.google/resolve?name=${domain}&type=NS`,
        { timeout: 5000 }
      );
      domainInfo.nameservers = nsResponse.data.Answer?.map((r: any) => r.data) || [];
    } catch (e) {
      // Ignorar erro de NS
    }

    return {
      success: true,
      data: domainInfo,
      source: 'DNS Google',
      timestamp: new Date().toISOString()
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Erro ao obter informações do domínio',
      source: 'DNS Google',
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Phone Number Lookup - Formato e validação básica
 */
export async function getPhoneInfo(phone: string): Promise<OSINTResult> {
  try {
    // Limpar número de telefone
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Análise básica do número
    let countryCode = '';
    let region = '';
    let carrier = 'Desconhecido';
    let valid = false;

    // Detectar códigos de país comuns
    if (cleanPhone.startsWith('55')) {
      countryCode = '+55';
      region = 'Brasil';
      valid = cleanPhone.length >= 10;
      
      // Detectar operadoras brasileiras básicas
      if (cleanPhone.length === 11 || cleanPhone.length === 13) {
        const areaCode = cleanPhone.substring(2, 4);
        const firstDigit = cleanPhone.substring(4, 5);
        
        if (['6', '7', '8', '9'].includes(firstDigit)) {
          carrier = 'Móvel';
        } else {
          carrier = 'Fixo';
        }
      }
    } else if (cleanPhone.startsWith('1') && cleanPhone.length === 11) {
      countryCode = '+1';
      region = 'Estados Unidos/Canadá';
      valid = true;
    } else if (cleanPhone.startsWith('44')) {
      countryCode = '+44';
      region = 'Reino Unido';
      valid = cleanPhone.length >= 10;
    }

    return {
      success: true,
      data: {
        originalNumber: phone,
        cleanNumber: cleanPhone,
        countryCode,
        region,
        carrier,
        valid,
        format: valid ? `${countryCode} ${cleanPhone.substring(countryCode.length - 1)}` : 'Formato inválido'
      },
      source: 'Análise Local',
      timestamp: new Date().toISOString()
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Erro ao analisar número de telefone',
      source: 'Análise Local',
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Username Check - Múltiplas plataformas
 */
export async function checkUsername(username: string): Promise<OSINTResult> {
  const platforms = [
    { name: 'GitHub', url: `https://github.com/${username}` },
    { name: 'Twitter', url: `https://twitter.com/${username}` },
    { name: 'Instagram', url: `https://instagram.com/${username}` },
    { name: 'LinkedIn', url: `https://linkedin.com/in/${username}` },
    { name: 'Reddit', url: `https://reddit.com/user/${username}` },
    { name: 'YouTube', url: `https://youtube.com/@${username}` },
    { name: 'TikTok', url: `https://tiktok.com/@${username}` },
    { name: 'Telegram', url: `https://t.me/${username}` }
  ];

  const results = [];

  try {
    // Verificar cada plataforma
    for (const platform of platforms) {
      try {
        const response = await axios.head(platform.url, {
          timeout: 5000,
          validateStatus: () => true // Aceitar todos os status codes
        });

        results.push({
          platform: platform.name,
          url: platform.url,
          exists: response.status === 200,
          status: response.status
        });
      } catch (error) {
        results.push({
          platform: platform.name,
          url: platform.url,
          exists: false,
          status: 'timeout/error'
        });
      }
    }

    const foundPlatforms = results.filter(r => r.exists);

    return {
      success: true,
      data: {
        username,
        totalChecked: platforms.length,
        found: foundPlatforms.length,
        platforms: results,
        foundPlatforms: foundPlatforms.map(p => ({
          name: p.platform,
          url: p.url
        }))
      },
      source: 'Username Check Multi-Platform',
      timestamp: new Date().toISOString()
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Erro ao verificar username',
      source: 'Username Check Multi-Platform',
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Hash Generator/Analyzer
 */
export async function generateHashes(input: string): Promise<OSINTResult> {
  try {
    const crypto = await import('crypto');
    
    const hashes = {
      md5: crypto.createHash('md5').update(input).digest('hex'),
      sha1: crypto.createHash('sha1').update(input).digest('hex'),
      sha256: crypto.createHash('sha256').update(input).digest('hex'),
      sha512: crypto.createHash('sha512').update(input).digest('hex')
    };

    return {
      success: true,
      data: {
        original: input,
        hashes,
        length: input.length
      },
      source: 'Hash Generator Local',
      timestamp: new Date().toISOString()
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Erro ao gerar hashes',
      source: 'Hash Generator Local',
      timestamp: new Date().toISOString()
    };
  }
}