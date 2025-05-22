from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.core.os_manager import ChromeType
import tempfile
import pytest

@pytest.fixture
def browser():
    # Configuración corregida
    service = Service(
        ChromeDriverManager(
            chrome_type=ChromeType.CHROMIUM,
            driver_version='136.0.7103.114'  # ✅ Parámetro correcto
        ).install()
    )
    options = webdriver.ChromeOptions()
    options.add_argument("--start-maximized")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(service=service, options=options)
    driver.implicitly_wait(10)
    yield driver
    driver.quit()

def test_login_success(browser):
    browser.get("http://localhost:5173/login")

    username = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="username-input"]'))
    )
    password = browser.find_element(By.CSS_SELECTOR, '[data-testid="password-input"]')
    login_btn = browser.find_element(By.CSS_SELECTOR, '[data-testid="login-button"]')

    username.send_keys("admin")
    password.send_keys("password123")
    login_btn.click()

    # CORRECCIÓN: Indentación del assert
    WebDriverWait(browser, 15).until(
        EC.url_to_be("http://localhost:5173/home")
    )
    assert browser.current_url == "http://localhost:5173/home"  # ✅ Indentación correcta

def test_login_failure(browser):
    browser.get("http://localhost:5173/login")

    username = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="username-input"]'))
    )
    password = browser.find_element(By.CSS_SELECTOR, '[data-testid="password-input"]')
    login_btn = browser.find_element(By.CSS_SELECTOR, '[data-testid="login-button"]')

    username.send_keys("usuario_invalido")
    password.send_keys("123")
    login_btn.click()

    error_message = WebDriverWait(browser, 10).until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, '[data-testid="error-message"]'))
    )
    assert "Usuario o contraseña incorrectos" in error_message.text

def test_register_button(browser):
    browser.get("http://localhost:5173/login")

    register_btn = WebDriverWait(browser, 10).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, '[data-testid="register-button"]'))
    )
    register_btn.click()

    WebDriverWait(browser, 10).until(
        EC.url_to_be("http://localhost:5173/register")  # Más preciso que url_contains
    )
    assert browser.current_url == "http://localhost:5173/register"