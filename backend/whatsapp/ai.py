CATEGORY_KEYWORDS = {
    "electrician": ["electricista", "luz", "corriente", "breaker", "enchufe", "corto"],
    "plumber": ["plomero", "tuberia", "tubería", "agua", "fuga", "baño", "lavaplatos"],
    "appliance-repair": ["nevera", "lavadora", "aire", "estufa", "electrodomestico", "electrodoméstico"],
    "locksmith": ["cerrajero", "cerradura", "llave", "puerta"],
}
URGENCY_KEYWORDS = ["urgente", "ya", "emergencia", "inmediato", "rapido", "rápido"]


def extract_intent(message: str) -> dict:
    text = message.lower()
    category = ""
    for slug, keywords in CATEGORY_KEYWORDS.items():
        if any(keyword in text for keyword in keywords):
            category = slug
            break

    location = ""
    if " en " in text:
        location = text.split(" en ", 1)[1].split(".", 1)[0].strip()

    urgency = "high" if any(keyword in text for keyword in URGENCY_KEYWORDS) else "normal"
    return {"category": category, "location": location, "urgency": urgency}
