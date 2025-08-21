import type {
  EmailLookupResult,
  DomainAnalysisResult,
  IPGeolocationResult,
  PhoneLookupResult,
  SocialMediaResult,
} from "@shared/schema";

// Email validation and breach checking
export async function performEmailLookup(email: string): Promise<EmailLookupResult> {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }

  try {
    // Use HaveIBeenPwned API for breach checking
    const breachApiKey = process.env.HIBP_API_KEY || "";
    const breaches = await checkEmailBreaches(email, breachApiKey);
    
    // Use Hunter.io or similar for email verification
    const hunterApiKey = process.env.HUNTER_API_KEY || "";
    const verification = await verifyEmail(email, hunterApiKey);
    
    // Social media checking
    const socialMedia = await checkSocialMediaPresence(email);
    
    return {
      valid: verification.valid,
      provider: getEmailProvider(email),
      disposable: verification.disposable || false,
      catchAll: verification.catchAll,
      breaches,
      socialMedia,
      additionalInfo: verification.additionalInfo,
    };
  } catch (error) {
    throw new Error(`Email lookup failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function performDomainAnalysis(domain: string): Promise<DomainAnalysisResult> {
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
  if (!domainRegex.test(domain)) {
    throw new Error("Invalid domain format");
  }

  try {
    // Use various APIs for domain analysis
    const whoisApiKey = process.env.WHOIS_API_KEY || "";
    const securityApiKey = process.env.VIRUSTOTAL_API_KEY || "";
    
    const [whoisData, subdomains, technologies, securityInfo] = await Promise.all([
      getWhoisData(domain, whoisApiKey),
      getSubdomains(domain),
      getTechnologies(domain),
      getSecurityInfo(domain, securityApiKey),
    ]);

    return {
      domain,
      registrar: whoisData.registrar || "Unknown",
      creationDate: whoisData.creationDate || "Unknown",
      expirationDate: whoisData.expirationDate || "Unknown",
      nameservers: whoisData.nameservers || [],
      whoisInfo: whoisData,
      subdomains,
      technologies,
      securityInfo,
    };
  } catch (error) {
    throw new Error(`Domain analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function performIPGeolocation(ip: string): Promise<IPGeolocationResult> {
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (!ipRegex.test(ip)) {
    throw new Error("Invalid IP address format");
  }

  try {
    const geoApiKey = process.env.IPGEOLOCATION_API_KEY || "";
    const threatApiKey = process.env.ABUSEIPDB_API_KEY || "";
    
    const [geoData, threatData] = await Promise.all([
      getIPGeolocation(ip, geoApiKey),
      getThreatIntelligence(ip, threatApiKey),
    ]);

    return {
      ip,
      country: geoData.country || "Unknown",
      region: geoData.region || "Unknown",
      city: geoData.city || "Unknown",
      isp: geoData.isp || "Unknown",
      organization: geoData.organization || "Unknown",
      asn: geoData.asn || "Unknown",
      vpn: geoData.vpn || false,
      proxy: geoData.proxy || false,
      threatLevel: threatData.threatLevel || "Low",
    };
  } catch (error) {
    throw new Error(`IP geolocation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function performPhoneLookup(phone: string): Promise<PhoneLookupResult> {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  if (!phoneRegex.test(phone.replace(/[-\s\(\)]/g, ""))) {
    throw new Error("Invalid phone number format");
  }

  try {
    const phoneApiKey = process.env.NUMVERIFY_API_KEY || "";
    const phoneData = await getPhoneInfo(phone, phoneApiKey);

    return {
      number: phone,
      country: phoneData.country || "Unknown",
      carrier: phoneData.carrier || "Unknown",
      lineType: phoneData.lineType || "Unknown",
      valid: phoneData.valid || false,
      location: {
        city: phoneData.location?.city,
        region: phoneData.location?.region,
      },
    };
  } catch (error) {
    throw new Error(`Phone lookup failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function performSocialMediaLookup(username: string): Promise<SocialMediaResult[]> {
  if (!username || username.length < 2) {
    throw new Error("Invalid username");
  }

  try {
    const platforms = ["twitter", "linkedin", "facebook", "instagram", "github"];
    const results = await Promise.all(
      platforms.map(platform => checkSocialPlatform(username, platform))
    );

    return results.filter(result => result !== null) as SocialMediaResult[];
  } catch (error) {
    throw new Error(`Social media lookup failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// Helper functions for API calls
async function checkEmailBreaches(email: string, apiKey: string) {
  if (!apiKey) {
    return []; // Return empty array if no API key
  }
  
  try {
    const response = await fetch(`https://haveibeenpwned.com/api/v3/breachedaccount/${email}`, {
      headers: {
        'hibp-api-key': apiKey,
        'User-Agent': 'OSINT-Panel'
      }
    });
    
    if (response.status === 404) {
      return []; // No breaches found
    }
    
    if (!response.ok) {
      throw new Error(`HIBP API error: ${response.status}`);
    }
    
    const breaches = await response.json();
    return breaches.map((breach: any) => ({
      name: breach.Name,
      date: breach.BreachDate,
      dataTypes: breach.DataClasses,
    }));
  } catch (error) {
    console.error("Breach check failed:", error);
    return [];
  }
}

async function verifyEmail(email: string, apiKey: string) {
  if (!apiKey) {
    return { valid: true, disposable: false, catchAll: null }; // Basic validation if no API key
  }
  
  try {
    const response = await fetch(`https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${apiKey}`);
    if (!response.ok) {
      throw new Error(`Hunter.io API error: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      valid: data.data.result === "deliverable",
      disposable: data.data.disposable,
      catchAll: data.data.accept_all,
      additionalInfo: data.data.sources?.length > 0 ? {
        company: data.data.sources[0]?.company,
      } : undefined,
    };
  } catch (error) {
    console.error("Email verification failed:", error);
    return { valid: true, disposable: false, catchAll: null };
  }
}

function getEmailProvider(email: string): string {
  const domain = email.split('@')[1]?.toLowerCase();
  const providers: Record<string, string> = {
    'gmail.com': 'Gmail',
    'yahoo.com': 'Yahoo',
    'outlook.com': 'Outlook',
    'hotmail.com': 'Hotmail',
    'protonmail.com': 'ProtonMail',
  };
  return providers[domain] || domain || 'Unknown';
}

async function checkSocialMediaPresence(email: string) {
  // This would typically use specialized APIs or services
  // For now, return empty array as this requires specific API integrations
  return [];
}

async function getWhoisData(domain: string, apiKey: string) {
  if (!apiKey) {
    return { registrar: "Unknown", creationDate: "Unknown", expirationDate: "Unknown", nameservers: [] };
  }
  
  try {
    const response = await fetch(`https://api.whoisfreaks.com/v1.0/whois?apiKey=${apiKey}&whois=live&domainName=${domain}`);
    if (!response.ok) {
      throw new Error(`WHOIS API error: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      registrar: data.registrar_name,
      creationDate: data.create_date,
      expirationDate: data.expire_date,
      nameservers: data.name_servers || [],
    };
  } catch (error) {
    console.error("WHOIS lookup failed:", error);
    return { registrar: "Unknown", creationDate: "Unknown", expirationDate: "Unknown", nameservers: [] };
  }
}

async function getSubdomains(domain: string): Promise<string[]> {
  // This would typically use specialized APIs like SecurityTrails or Sublist3r
  return [];
}

async function getTechnologies(domain: string): Promise<string[]> {
  // This would typically use APIs like Wappalyzer or BuiltWith
  return [];
}

async function getSecurityInfo(domain: string, apiKey: string) {
  if (!apiKey) {
    return { ssl: true, malware: false, phishing: false };
  }
  
  try {
    const response = await fetch(`https://www.virustotal.com/vtapi/v2/domain/report?apikey=${apiKey}&domain=${domain}`);
    if (!response.ok) {
      throw new Error(`VirusTotal API error: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      ssl: true, // Would check SSL certificate
      malware: data.detected_urls?.length > 0 || false,
      phishing: data.categories?.includes('phishing') || false,
    };
  } catch (error) {
    console.error("Security check failed:", error);
    return { ssl: true, malware: false, phishing: false };
  }
}

async function getIPGeolocation(ip: string, apiKey: string) {
  if (!apiKey) {
    return { country: "Unknown", region: "Unknown", city: "Unknown", isp: "Unknown", organization: "Unknown", asn: "Unknown" };
  }
  
  try {
    const response = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${ip}`);
    if (!response.ok) {
      throw new Error(`IP Geolocation API error: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      country: data.country_name,
      region: data.state_prov,
      city: data.city,
      isp: data.isp,
      organization: data.organization,
      asn: data.asn,
      vpn: data.threat?.is_anonymous || false,
      proxy: data.threat?.is_proxy || false,
    };
  } catch (error) {
    console.error("IP geolocation failed:", error);
    return { country: "Unknown", region: "Unknown", city: "Unknown", isp: "Unknown", organization: "Unknown", asn: "Unknown" };
  }
}

async function getThreatIntelligence(ip: string, apiKey: string) {
  if (!apiKey) {
    return { threatLevel: "Low" };
  }
  
  try {
    const response = await fetch(`https://api.abuseipdb.com/api/v2/check?ipAddress=${ip}`, {
      headers: {
        'Key': apiKey,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`AbuseIPDB API error: ${response.status}`);
    }
    
    const data = await response.json();
    const confidence = data.data.abuseConfidencePercentage || 0;
    
    let threatLevel = "Low";
    if (confidence > 75) threatLevel = "High";
    else if (confidence > 25) threatLevel = "Medium";
    
    return { threatLevel };
  } catch (error) {
    console.error("Threat intelligence failed:", error);
    return { threatLevel: "Low" };
  }
}

async function getPhoneInfo(phone: string, apiKey: string) {
  if (!apiKey) {
    return { country: "Unknown", carrier: "Unknown", lineType: "Unknown", valid: false };
  }
  
  try {
    const response = await fetch(`http://apilayer.net/api/validate?access_key=${apiKey}&number=${phone}`);
    if (!response.ok) {
      throw new Error(`Numverify API error: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      country: data.country_name,
      carrier: data.carrier,
      lineType: data.line_type,
      valid: data.valid,
      location: {
        city: data.location,
        region: data.country_name,
      },
    };
  } catch (error) {
    console.error("Phone lookup failed:", error);
    return { country: "Unknown", carrier: "Unknown", lineType: "Unknown", valid: false };
  }
}

async function checkSocialPlatform(username: string, platform: string): Promise<SocialMediaResult | null> {
  // This would typically check if a username exists on various platforms
  // For now, return null as this requires specific API integrations
  return null;
}
