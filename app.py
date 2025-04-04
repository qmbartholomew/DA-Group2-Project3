#from module 10 day 3 activity 6

# Import the dependencies.
import sqlite3
from flask import Flask, jsonify, request

#create the app
app = Flask(__name__)

#flask routes
# #Homepage Route
@app.route("/")
def welcome():
    """List all available currency routes."""
    return (
        f"Available Foreign Currency Routes:<br/>"
        f"<br/>"
        f"EURO<br/>"
        f"JPY<br/>"
        f"CAD<br/>"
    )

# @app.route("/api/vi.0/Foreign Currencies")

def currencies():
    conn = sqlite3.connect('currency')
    conn.row_factory = sqlite3.Row
    return conn

# def get_db_connection():
#     conn = sqlite3.connect('currency.sqlite')
#     conn.row_factory = sqlite3.Row
#     return conn

@app.route('/EURO', methods=['GET'])
def get_eur_usd():
    conn = currencies()
    rows = conn.execute('SELECT * FROM euro_usd').fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])

@app.route('/JPY', methods=['GET'])
def get_jpy_usd():
    conn = currencies()
    rows = conn.execute('SELECT * FROM jpy_usd').fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])

@app.route('/CAD', methods=['GET'])
def get_cad_usd():
    conn = currencies()
    rows = conn.execute('SELECT * FROM cad_usd').fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])

if __name__ == '__main__':
    app.run(debug=True, port=5000)



#original thought process

# # Database Setup
# engine= create_engine("sqlite://currency.sqlite")

# # reflect an existing database into a new model
# Base = automap_base()

# # reflect the tables
# Base.prepare(autoload_with=engine)

# # Save reference to the table
# euro = Base.classes.euro_usd #euro_usd class
# jpy = Base.classes.jpy_usd #jyp_usd class
# cad = Base.classes.cad_usd #cad_usd class

# # Create our session (link) from Python to the DB
# session = Session(bind=engine)

# # Flask setup
# app = Flask(__name__)

# #Homepage Route
# @app.route("/")
# def welcome():
#     """List all available API routes."""
#     return (
#         f"Available Routes:<br/>"
#         f"euro_usd<br/>"
#         f"jpy_usd<br/>"
#         f"cad_usd<br/>"
#     )