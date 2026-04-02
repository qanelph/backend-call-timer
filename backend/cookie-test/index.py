import json


def handler(event: dict, context) -> dict:
    """Возвращает все куки, переданные в запросе"""
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Cookie',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    headers = event.get('headers', {}) or {}
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
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
        'body': json.dumps({
            'cookies': cookies,
            'raw': cookie_header,
            'total': len(cookies),
        })
    }
