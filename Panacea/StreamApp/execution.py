from kafka import KafkaConsumer
import json
from UserHandler.execution import connect
import threading
import datetime


def insertData(msg):
    patient_id = msg.value['patient_id']
    heartbeat = msg.value['heartbeat']
    sys_bp = msg.value['sys_blood_pressure']
    dia_bp = msg.value['dias_blood_pressure']
    body_temp = msg.value['body_temp']
    oxygen_level = msg.value['oxygen_level']
    breathing_rate = msg.value['breathing_rate']
    timestamp = datetime.datetime.fromtimestamp(msg.timestamp/1e3)
    print(heartbeat, timestamp)
    connection = connect()
    cursor = connection.cursor()
    query = '''INSERT INTO MONITORING_DATA(PATIENT_ID, HEARTBEAT, SYS_BP, DIAS_BP, TEMPERATURE, OXY_LEVEL, BREATHING_RATE, TIME)
                VALUES(:patient_id, :heartbeat, :sys_bp, :dia_bp, :body_temp, :oxygen_level, :breathing_rate, :timestamp)'''
    cursor.execute(query, [patient_id, heartbeat, sys_bp, dia_bp, body_temp, oxygen_level, breathing_rate, timestamp])
    connection.commit()
    cursor.close()

    condition_analyst(patient_id, heartbeat, sys_bp, dia_bp, body_temp, oxygen_level, breathing_rate)


def consumerFunction():
    print("Initializing Thread")
    consumer = KafkaConsumer('SensorData', value_deserializer=lambda m: json.loads(m.decode('utf-8')))
    for msg in consumer:
        x = threading.Thread(target=insertData, args=(msg, ), daemon=True)
        x.start()


def score_calculator(heartbeat, sys_bp, dia_bp, body_temp, oxygen_level, breathing_rate):
    score = 0
    if heartbeat > 93.0 or heartbeat < 55.0:
        score = score + 1
    if sys_bp > 140.0 :
        score = score + 1
    if dia_bp < 65.0 :
        score = score + 1
    if body_temp < 97.0 or body_temp > 103.0:
        score = score + 1
    if oxygen_level < 0.88:
        score = score + 1
    if breathing_rate > 17.0 or breathing_rate < 13.0:
        score = score + 1
    return score


def condition_analyst(patient_id, heartbeat, sys_bp, dia_bp, body_temp, oxygen_level, breathing_rate):
    score = score_calculator(heartbeat, sys_bp, dia_bp, body_temp, oxygen_level, breathing_rate)

    if score >= 3:
        query = '''SELECT * FROM (SELECT * FROM MONITORING_DATA WHERE PATIENT_ID = (:patient_id) ORDER BY SL_NO DESC) WHERE ROWNUM<=6'''
        connection = connect()
        cursor = connection.cursor()
        cursor.execute(query, [patient_id])
        last_five = cursor.fetchall()
        list_hrate = []
        list_sys_bp = []
        list_dia_bp = []
        list_body_temp = []
        list_olevel = []
        list_brate = []
        for data in last_five:
            list_hrate.append(data[2])
            list_brate.append(data[7])
            list_olevel.append(data[6])
            list_sys_bp.append(data[3])
            list_dia_bp.append(data[4])
            list_body_temp.append(data[5])
        avg_hrate = sum(list_hrate)/5
        avg_sys_bp = sum(list_sys_bp)/5
        avg_dia_bp = sum(list_dia_bp)/5
        avg_body_temp = sum(list_body_temp)/5
        avg_oxy_level = sum(list_olevel)/5
        avg_brate = sum(list_brate)/5   
        score_avg = score_calculator(avg_hrate, avg_sys_bp, avg_dia_bp, avg_body_temp, avg_oxy_level, avg_brate)
        if score_avg >= 3.5:
            query = '''SELECT B.INCHARGE_ID, R.BLOCK_ID, RA.ROOM_NO, (P.FIRST_NAME||' '||P.LAST_NAME) AS NAME, P.USER_ID 
                        FROM ROOM_ADMISSION RA JOIN ROOM R 
                        ON (RA.PATIENT_ID = (:patient_id) AND RA.RELEASE_DATE IS NULL AND R.ROOM_NO=RA.ROOM_NO) 
                        JOIN BLOCK B 
                        ON (R.BLOCK_ID = B.BLOCK_ID) JOIN PERSON P ON P.ID = (:patient_id)'''
            cursor.execute(query, [patient_id])
            result = cursor.fetchall()
            name = result[0][3]
            block_id = result[0][1]
            room_no = result[0][2]
            patient_userID = result[0][4]
            doctor_id = result[0][0]

            message = f'''Emergency! The patient {patient_userID}-{name} in block-{block_id}, room-{room_no} needs emergency attention.
                            Seriousness Level-{score_avg}/5'''

            query = '''INSERT INTO NOTIFICATION(USER_ID, STATUS, MESSAGE) VALUES
                        (:doctor_id, 'I', :message)'''
            cursor.execute(query, [doctor_id, message])
            connection.commit()
            cursor.close()