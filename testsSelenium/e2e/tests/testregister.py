from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import pytest

@pytest.fixture
def browser():
    driver = webdriver.Chrome()
    driver.get("http://localhost:5173/register")
    driver.maximize_window()  # Maximizar ventana para mejor visualización
    yield driver
    driver.quit()

def test_registro_exitoso(browser):
    wait = WebDriverWait(browser, 15)  # Aumentar tiempo de espera

    try:
        # Llenar formulario con esperas explícitas
        username_field = wait.until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='text']"))
        )
        username_field.send_keys("UsuarioTest")

        email_field = browser.find_element(By.CSS_SELECTOR, "input[type='email']")
        email_field.send_keys("test@example.com")

        password_field = browser.find_element(By.CSS_SELECTOR, "input[type='password']")
        password_field.send_keys("Pass123!")

        # Manejo del dropdown con esperas combinadas
        dropdown = wait.until(
            EC.element_to_be_clickable((By.CLASS_NAME, "react-select__control"))
        )
        dropdown.click()

        # Selección de opción con texto exacto
        option = wait.until(
            EC.visibility_of_element_located(
                (By.XPATH, "//div[contains(text(), '¿Cuál es el nombre de tu mascota?')]")
            )
        )
        option.click()

        # Respuesta de seguridad
        answer_field = browser.find_element(
            By.XPATH, "//input[@placeholder='Respuesta']"
        )
        answer_field.send_keys("Max")

        # Envío de formulario
        submit_button = browser.find_element(
            By.XPATH, "//button[text()='Registrarme']"
        )
        submit_button.click()

        # Verificación final con espera adecuada
        wait.until(
            EC.url_to_be("http://localhost:5173/login")
        )

    except Exception as e:
        # Tomar captura de pantalla en caso de error
        browser.save_screenshot("error_registro.png")
        raise e