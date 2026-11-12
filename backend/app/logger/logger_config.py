import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        # logging.FileHandler('app.log'),  # Log to file 'app.log'
        logging.StreamHandler()  # Also log to console
    ]
)

logger = logging.getLogger(__name__)
