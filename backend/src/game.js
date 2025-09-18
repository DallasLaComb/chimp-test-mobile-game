exports.handler = async (event) => {
    const { httpMethod, path, body } = event;
    
    try {
        switch (httpMethod) {
            case 'POST':
                if (path.includes('/start')) {
                    return {
                        statusCode: 200,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ gameId: Date.now(), status: 'started' })
                    };
                }
                break;
            case 'GET':
                return {
                    statusCode: 200,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: 'Chimp Test API' })
                };
        }
        
        return {
            statusCode: 404,
            body: JSON.stringify({ error: 'Not found' })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};