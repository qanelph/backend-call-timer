import json


def handler(event: dict, context) -> dict:
    """Возвращает все куки, переданные в запросе"""
    headers = event.get('headers', {}) or {}
    origin = headers.get('origin', headers.get('Origin', '*'))

    cors_headers = {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Cookie',
        'Access-Control-Max-Age': '86400',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}

    cookie_header = headers.get('X-Cookie', '') or headers.get('cookie', '')

    cookies = {}
    if cookie_header:
        for part in cookie_header.split(';'):
            part = part.strip()
            if '=' in part:
                key, _, value = part.partition('=')
                cookies[key.strip()] = value.strip()

    return {
        'statusCode': 200,
        'headers': {**cors_headers, 'Content-Type': 'application/json'},
        'body': json.dumps({
            'cookies': cookies,
            'raw': cookie_header,
            'total': len(cookies),
        })
    }
